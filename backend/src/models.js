const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: true },
  googleId: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "admin" }
});

const Client = sequelize.define("Client", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  birthDate: { type: DataTypes.DATEONLY },
  accessCode: { type: DataTypes.STRING }
});

const Professional = sequelize.define("Professional", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  defaultCommissionPercent: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 }
});

const Service = sequelize.define("Service", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  durationMinutes: { type: DataTypes.INTEGER, defaultValue: 60 },
  commissionPercent: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 }
});

const WeeklySchedule = sequelize.define("WeeklySchedule", {
  weekday: { type: DataTypes.INTEGER, allowNull: false },
  startTime: { type: DataTypes.STRING, allowNull: false },
  endTime: { type: DataTypes.STRING, allowNull: false },
  active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

const DateBlock = sequelize.define("DateBlock", {
  date: { type: DataTypes.DATEONLY, allowNull: false },
  reason: { type: DataTypes.STRING }
});

const ExtraSlot = sequelize.define("ExtraSlot", {
  date: { type: DataTypes.DATEONLY, allowNull: false },
  startTime: { type: DataTypes.STRING, allowNull: false },
  endTime: { type: DataTypes.STRING, allowNull: false }
});

const Appointment = sequelize.define("Appointment", {
  date: { type: DataTypes.DATEONLY, allowNull: false },
  startTime: { type: DataTypes.STRING, allowNull: false },
  endTime: { type: DataTypes.STRING, allowNull: false },
  status: {
    type: DataTypes.ENUM("pendente", "aprovado", "recusado", "cancelado"),
    defaultValue: "pendente"
  },
  totalPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  professionalAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  clinicAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  notes: { type: DataTypes.TEXT },
  whatsappLink: { type: DataTypes.TEXT }
});

const MedicalRecord = sequelize.define("MedicalRecord", {
  mainComplaint: { type: DataTypes.TEXT },
  objective: { type: DataTypes.TEXT },
  history: { type: DataTypes.TEXT },
  restrictions: { type: DataTypes.TEXT },
  allergies: { type: DataTypes.TEXT },
  weight: { type: DataTypes.DECIMAL(6, 2) },
  height: { type: DataTypes.DECIMAL(5, 2) },
  bodyFat: { type: DataTypes.DECIMAL(5, 2) },
  notes: { type: DataTypes.TEXT }
});

const FoodPlan = sequelize.define("FoodPlan", {
  title: { type: DataTypes.STRING, allowNull: false },
  objective: { type: DataTypes.TEXT },
  startDate: { type: DataTypes.DATEONLY },
  endDate: { type: DataTypes.DATEONLY },
  status: { type: DataTypes.STRING, defaultValue: "ativo" },
  generalGuidelines: { type: DataTypes.TEXT }
});

const Meal = sequelize.define("Meal", {
  name: { type: DataTypes.STRING, allowNull: false },
  time: { type: DataTypes.STRING },
  instructions: { type: DataTypes.TEXT },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const MealOption = sequelize.define("MealOption", {
  description: { type: DataTypes.TEXT, allowNull: false },
  calories: { type: DataTypes.INTEGER },
  protein: { type: DataTypes.DECIMAL(6, 2) },
  carbs: { type: DataTypes.DECIMAL(6, 2) },
  fat: { type: DataTypes.DECIMAL(6, 2) }
});

const FoodDiary = sequelize.define("FoodDiary", {
  date: { type: DataTypes.DATEONLY, allowNull: false },
  mealName: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  feeling: { type: DataTypes.STRING },
  photoUrl: { type: DataTypes.TEXT }
});

const ShoppingListItem = sequelize.define("ShoppingListItem", {
  name: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.STRING },
  checked: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const Recipe = sequelize.define("Recipe", {
  title: { type: DataTypes.STRING, allowNull: false },
  ingredients: { type: DataTypes.TEXT },
  preparation: { type: DataTypes.TEXT },
  tags: { type: DataTypes.STRING }
});

const Payment = sequelize.define("Payment", {
  description: { type: DataTypes.STRING },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  method: { type: DataTypes.STRING, defaultValue: "Pix" },
  status: { type: DataTypes.STRING, defaultValue: "pendente" },
  paymentUrl: { type: DataTypes.TEXT }
});

const InstagramLead = sequelize.define("InstagramLead", {
  name: { type: DataTypes.STRING },
  instagram: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  source: { type: DataTypes.STRING, defaultValue: "Instagram" },
  notes: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: "novo" }
});

Client.hasMany(Appointment); Appointment.belongsTo(Client);
Professional.hasMany(Appointment); Appointment.belongsTo(Professional);
Service.hasMany(Appointment); Appointment.belongsTo(Service);

Client.hasMany(MedicalRecord); MedicalRecord.belongsTo(Client);
Client.hasMany(FoodPlan); FoodPlan.belongsTo(Client);
FoodPlan.hasMany(Meal); Meal.belongsTo(FoodPlan);
Meal.hasMany(MealOption); MealOption.belongsTo(Meal);
Client.hasMany(FoodDiary); FoodDiary.belongsTo(Client);
Client.hasMany(ShoppingListItem); ShoppingListItem.belongsTo(Client);
Client.hasMany(Payment); Payment.belongsTo(Client);

module.exports = {
  sequelize,
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
};
