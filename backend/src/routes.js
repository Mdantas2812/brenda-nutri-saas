const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const {
  User,
  Client,
  Professional,
  Service,
  WeeklySchedule,
  DateBlock,
  ExtraSlot,
  Appointment,
  MedicalRecord,
  FoodPlan,
  Meal,
  MealOption,
  FoodDiary,
  ShoppingListItem,
  Recipe,
  Payment,
  InstagramLead
} = require("./models");

const { auth, createToken } = require("./auth");
const { generateSlots, makeWhatsappLink, randomAccessCode } = require("./utils");
const { sendEmail } = require("./email");
const { createPaymentLink } = require("./integrations");

router.get("/health", (req, res) => res.json({ ok: true, sistema: "Brenda Nutri SaaS Completo" }));

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !user.passwordHash) return res.status(401).json({ error: "Login inválido" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Login inválido" });

  res.json({ token: createToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.get("/auth/google/status", (req, res) => {
  res.json({
    ativo: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    mensagem: "Estrutura preparada. Configure GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET para ativar login com Google."
  });
});

router.get("/public/services", async (req, res) => res.json(await Service.findAll({ order: [["price", "ASC"]] })));
router.get("/public/professionals", async (req, res) => res.json(await Professional.findAll()));

router.get("/available-slots", async (req, res) => {
  const { date, serviceId } = req.query;
  if (!date || !serviceId) return res.status(400).json({ error: "Informe data e serviço" });

  const service = await Service.findByPk(serviceId);
  if (!service) return res.status(404).json({ error: "Serviço não encontrado" });

  const blocked = await DateBlock.findOne({ where: { date } });
  if (blocked) return res.json([]);

  const weekday = new Date(`${date}T12:00:00`).getDay();
  const weeklySchedules = await WeeklySchedule.findAll({ where: { weekday, active: true } });
  const extraSlots = await ExtraSlot.findAll({ where: { date } });

  let slots = [];
  for (const s of weeklySchedules) slots.push(...generateSlots(s.startTime, s.endTime, service.durationMinutes));
  for (const s of extraSlots) slots.push(...generateSlots(s.startTime, s.endTime, service.durationMinutes));

  const appointments = await Appointment.findAll({ where: { date, status: ["pendente", "aprovado"] } });
  const busy = appointments.map(a => `${a.startTime}-${a.endTime}`);

  res.json(slots.filter(s => !busy.includes(`${s.startTime}-${s.endTime}`)));
});

router.post("/appointments/request", async (req, res) => {
  const { client, serviceId, professionalId, date, startTime, endTime, notes } = req.body;

  let foundClient = client.email ? await Client.findOne({ where: { email: client.email } }) : null;
  if (!foundClient) foundClient = await Client.create({ ...client, accessCode: randomAccessCode() });

  const service = await Service.findByPk(serviceId);
  const professional = await Professional.findByPk(professionalId);
  if (!service || !professional) return res.status(404).json({ error: "Serviço ou profissional não encontrado" });

  const commission = Number(service.commissionPercent || professional.defaultCommissionPercent || 0);
  const totalPrice = Number(service.price);
  const professionalAmount = totalPrice * commission / 100;
  const clinicAmount = totalPrice - professionalAmount;
  const status = process.env.AUTO_APPROVE_APPOINTMENTS === "true" ? "aprovado" : "pendente";

  const message = `Olá, Brenda! Nova solicitação de agendamento.\n\nCliente: ${foundClient.name}\nTelefone: ${foundClient.phone || ""}\nServiço: ${service.name}\nData: ${date}\nHorário: ${startTime} até ${endTime}\nObservação: ${notes || "Sem observação"}`;
  const whatsappLink = makeWhatsappLink(process.env.BRENDANUTRI_WHATSAPP, message);

  const appointment = await Appointment.create({
    ClientId: foundClient.id,
    ServiceId: service.id,
    ProfessionalId: professional.id,
    date,
    startTime,
    endTime,
    status,
    totalPrice,
    professionalAmount,
    clinicAmount,
    notes,
    whatsappLink
  });

  const payment = await Payment.create({
    ClientId: foundClient.id,
    description: service.name,
    amount: totalPrice,
    method: "Pix/cartão",
    status: "pendente",
    paymentUrl: (await createPaymentLink({ amount: totalPrice, description: service.name })).paymentUrl
  });

  res.json({ appointment, payment, whatsappLink, accessCode: foundClient.accessCode });
});

router.post("/patient/login", async (req, res) => {
  const { email, accessCode } = req.body;
  const client = await Client.findOne({ where: { email, accessCode } });
  if (!client) return res.status(401).json({ error: "Dados inválidos" });
  res.json({ client });
});

router.get("/patient/:clientId/portal", async (req, res) => {
  const client = await Client.findByPk(req.params.clientId);
  if (!client) return res.status(404).json({ error: "Paciente não encontrado" });

  const plans = await FoodPlan.findAll({
    where: { ClientId: client.id },
    include: [{ model: Meal, include: [MealOption] }],
    order: [["createdAt", "DESC"]]
  });

  const appointments = await Appointment.findAll({ where: { ClientId: client.id }, order: [["date", "DESC"]] });
  const shopping = await ShoppingListItem.findAll({ where: { ClientId: client.id } });
  const payments = await Payment.findAll({ where: { ClientId: client.id }, order: [["createdAt", "DESC"]] });

  res.json({ client, plans, appointments, shopping, payments });
});

router.post("/patient/:clientId/diary", async (req, res) => {
  const item = await FoodDiary.create({ ...req.body, ClientId: req.params.clientId });
  res.json(item);
});

router.use(auth);

router.get("/me", (req, res) => res.json(req.user));

router.get("/clients", async (req, res) => res.json(await Client.findAll({ order: [["createdAt", "DESC"]] })));
router.post("/clients", async (req, res) => res.json(await Client.create({ ...req.body, accessCode: randomAccessCode() })));

router.get("/appointments", async (req, res) => {
  res.json(await Appointment.findAll({
    include: [Client, Service, Professional],
    order: [["date", "DESC"], ["startTime", "ASC"]]
  }));
});

router.patch("/appointments/:id/status", async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id, { include: [Client, Service, Professional] });
  if (!appointment) return res.status(404).json({ error: "Agendamento não encontrado" });

  appointment.status = req.body.status;
  await appointment.save();

  if (appointment.Client?.email && ["aprovado", "recusado"].includes(req.body.status)) {
    await sendEmail({
      to: appointment.Client.email,
      subject: req.body.status === "aprovado" ? "Agendamento confirmado" : "Agendamento recusado",
      html: `<h2>Status do agendamento: ${req.body.status}</h2><p>Data: ${appointment.date}</p><p>Horário: ${appointment.startTime}</p>`
    });
  }

  res.json(appointment);
});

router.get("/finance/summary", async (req, res) => {
  const approved = await Appointment.findAll({ where: { status: "aprovado" } });
  const pending = await Appointment.count({ where: { status: "pendente" } });
  const revenue = approved.reduce((sum, a) => sum + Number(a.totalPrice || 0), 0);
  const professionalAmount = approved.reduce((sum, a) => sum + Number(a.professionalAmount || 0), 0);
  const clinicAmount = approved.reduce((sum, a) => sum + Number(a.clinicAmount || 0), 0);
  res.json({ revenue, professionalAmount, clinicAmount, approvedAppointments: approved.length, pendingAppointments: pending });
});

router.get("/services", async (req, res) => res.json(await Service.findAll()));
router.post("/services", async (req, res) => res.json(await Service.create(req.body)));
router.get("/professionals", async (req, res) => res.json(await Professional.findAll()));
router.post("/professionals", async (req, res) => res.json(await Professional.create(req.body)));
router.get("/weekly-schedules", async (req, res) => res.json(await WeeklySchedule.findAll({ order: [["weekday", "ASC"]] })));
router.post("/weekly-schedules", async (req, res) => res.json(await WeeklySchedule.create(req.body)));
router.post("/date-blocks", async (req, res) => res.json(await DateBlock.create(req.body)));
router.post("/extra-slots", async (req, res) => res.json(await ExtraSlot.create(req.body)));

router.get("/medical-records", async (req, res) => res.json(await MedicalRecord.findAll({ include: [Client], order: [["createdAt", "DESC"]] })));
router.post("/medical-records", async (req, res) => res.json(await MedicalRecord.create(req.body)));

router.get("/food-plans", async (req, res) => {
  res.json(await FoodPlan.findAll({ include: [Client, { model: Meal, include: [MealOption] }], order: [["createdAt", "DESC"]] }));
});

router.post("/food-plans", async (req, res) => {
  const { meals = [], ...planData } = req.body;
  const plan = await FoodPlan.create(planData);

  for (const mealData of meals) {
    const { options = [], ...mealRest } = mealData;
    const meal = await Meal.create({ ...mealRest, FoodPlanId: plan.id });
    for (const option of options) await MealOption.create({ ...option, MealId: meal.id });
  }

  res.json(await FoodPlan.findByPk(plan.id, { include: [{ model: Meal, include: [MealOption] }, Client] }));
});

router.get("/payments", async (req, res) => res.json(await Payment.findAll({ include: [Client], order: [["createdAt", "DESC"]] })));
router.post("/payments", async (req, res) => {
  const result = await createPaymentLink({ amount: req.body.amount, description: req.body.description });
  const payment = await Payment.create({ ...req.body, paymentUrl: result.paymentUrl });
  res.json(payment);
});

router.get("/instagram-leads", async (req, res) => res.json(await InstagramLead.findAll({ order: [["createdAt", "DESC"]] })));
router.post("/instagram-leads", async (req, res) => res.json(await InstagramLead.create(req.body)));

router.get("/recipes", async (req, res) => res.json(await Recipe.findAll()));
router.post("/recipes", async (req, res) => res.json(await Recipe.create(req.body)));

module.exports = router;
