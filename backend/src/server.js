const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");
const { sequelize } = require("./models");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "2mb" }));
app.use("/api", routes);

app.get("/seed", async (req, res) => {
  try {
    const seed = require("./seed");
    await seed();
    res.send("Seed executado!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const port = process.env.PORT || 4000;

async function start() {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(port, () => console.log(`Backend rodando em http://localhost:${port}`));
}

start().catch(error => console.error("Erro ao iniciar backend:", error));