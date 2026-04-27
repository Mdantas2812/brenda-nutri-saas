const bcrypt = require("bcryptjs");
const {
  sequelize,
  User,
  Client,
  Professional,
  Service,
  WeeklySchedule,
  MedicalRecord,
  FoodPlan,
  Meal,
  MealOption,
  ShoppingListItem,
  Recipe
} = require("./models");

async function run() {
  await sequelize.sync({ force: true });

  await User.create({
    name: "Brenda Coutinho",
    email: "brenda@email.com",
    passwordHash: await bcrypt.hash("brenda123", 10),
    role: "admin"
  });

  const brenda = await Professional.create({
    name: "Brenda Coutinho",
    email: "brenda@email.com",
    defaultCommissionPercent: 100
  });

  await Service.bulkCreate([
    { name: "Consulta Nutricional", description: "Consulta completa com avaliação e orientação nutricional.", price: 250, durationMinutes: 60, commissionPercent: 100 },
    { name: "Retorno Nutricional", description: "Retorno para acompanhamento e ajustes.", price: 120, durationMinutes: 30, commissionPercent: 100 },
    { name: "Consulta Materno-Infantil", description: "Atendimento especializado para mães, gestantes e crianças.", price: 280, durationMinutes: 60, commissionPercent: 100 }
  ]);

  await WeeklySchedule.bulkCreate([
    { weekday: 1, startTime: "09:00", endTime: "12:00" },
    { weekday: 1, startTime: "14:00", endTime: "18:00" },
    { weekday: 2, startTime: "09:00", endTime: "12:00" },
    { weekday: 2, startTime: "14:00", endTime: "18:00" },
    { weekday: 3, startTime: "09:00", endTime: "12:00" },
    { weekday: 3, startTime: "14:00", endTime: "18:00" },
    { weekday: 4, startTime: "09:00", endTime: "12:00" },
    { weekday: 4, startTime: "14:00", endTime: "18:00" },
    { weekday: 5, startTime: "09:00", endTime: "12:00" }
  ]);

  const client = await Client.create({
    name: "Paciente Exemplo",
    email: "paciente@email.com",
    phone: "27999999999",
    accessCode: "ABC123"
  });

  await MedicalRecord.create({
    ClientId: client.id,
    mainComplaint: "Deseja melhorar rotina alimentar e organização das refeições.",
    objective: "Melhorar hábitos alimentares.",
    restrictions: "Sem restrições informadas.",
    allergies: "Sem alergias informadas.",
    weight: 70,
    height: 1.70,
    notes: "Prontuário exemplo para demonstração."
  });

  const plan = await FoodPlan.create({
    ClientId: client.id,
    title: "Plano alimentar inicial",
    objective: "Organização alimentar e rotina saudável.",
    startDate: "2026-04-27",
    status: "ativo",
    generalGuidelines: "Beber água ao longo do dia, respeitar sinais de fome e manter rotina alimentar."
  });

  const meal1 = await Meal.create({ FoodPlanId: plan.id, name: "Café da manhã", time: "07:30", order: 1, instructions: "Escolha uma opção." });
  await MealOption.bulkCreate([
    { MealId: meal1.id, description: "Iogurte natural com fruta e aveia.", calories: 280, protein: 16, carbs: 38, fat: 7 },
    { MealId: meal1.id, description: "Ovos mexidos com pão integral e fruta.", calories: 330, protein: 22, carbs: 32, fat: 12 }
  ]);

  const meal2 = await Meal.create({ FoodPlanId: plan.id, name: "Almoço", time: "12:30", order: 2, instructions: "Montar prato com proteína, carboidrato e salada." });
  await MealOption.create({ MealId: meal2.id, description: "Arroz, feijão, frango grelhado e salada.", calories: 520, protein: 38, carbs: 62, fat: 12 });

  await ShoppingListItem.bulkCreate([
    { ClientId: client.id, name: "Iogurte natural", quantity: "4 unidades" },
    { ClientId: client.id, name: "Aveia", quantity: "1 pacote" },
    { ClientId: client.id, name: "Frutas", quantity: "7 porções" }
  ]);

  await Recipe.create({
    title: "Panqueca de banana",
    ingredients: "1 banana, 1 ovo, 2 colheres de aveia.",
    preparation: "Misture tudo e leve à frigideira antiaderente.",
    tags: "café da manhã, lanche"
  });

  console.log("Banco criado. Login Brenda: brenda@email.com / brenda123. Portal paciente: paciente@email.com / ABC123");
  process.exit();
}

run();
