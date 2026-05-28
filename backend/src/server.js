import express from 'express';
import { prisma } from "./config/db.js";
import authRouter from './registerLogin/auth.js';
import progress from './HandleProgress/auth.js'
import { config } from 'dotenv';
import cors from 'cors';

config();

const app = express();
const PORT = 5001;

app.use(cors({
  origin: [
    "https://quran-monitoring-6jsdw3djr-fairuz-physic1.vercel.app",
    "http://localhost:5173"  // buat local development tetep works
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use('/auth/login', progress)

app.patch('/progress/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await prisma.progressLog.update({
      where: { id },
      data: { status }
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const server = app.listen(PORT, () =>{
    console.log(`server is running on port ${PORT}`);
})

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
