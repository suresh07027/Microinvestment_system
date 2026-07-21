import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "https://microinvestment-system.vercel.app" }));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed!");
    console.error("Message:", err.message);
    console.error("Name:", err.name);
    console.error("Code:", err.code);
  });

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'MicroInvest API is running! 🚀' });
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});