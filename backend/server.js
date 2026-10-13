const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Order = require("./models/Order");

const app = express();


app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 Conectado exitosamente a MongoDB Local (Velluto)"))
  .catch((err) => console.error("🔴 Error al conectar a MongoDB:", err));

app.post("/api/orders", async (req, res) => {
  try {
    const { cart, subtotal, shippingFee, total } = req.body;

    const newOrder = new Order({
      orderNumber: `VE-${Math.floor(1000 + Math.random() * 9000)}`,
      items: cart,
      subtotal,
      shippingFee,
      total,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error al guardar la orden", error });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las órdenes", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`));