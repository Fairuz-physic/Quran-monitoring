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
  origin: "https://quran-monitoring.vercel.app",
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

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}

export default app;