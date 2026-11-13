import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import serviceRoutes from "./routes/service.routes.js"; 
import clientRoutes from "./routes/client.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/services", serviceRoutes);
app.use("/clients", clientRoutes);
app.use("/payments", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
