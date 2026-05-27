import { prisma } from "../config/db.js";

const receiveData = async (req, res) => {
  try {
    const { 
      userId, 
      juz,
      startedSurah, 
      startedAyah, 
      finishedSurah, 
      finishedAyah,  
      timeStarted, 
      timeFinished 
    } = req.body;

    if (
      !userId || !juz ||
      !startedSurah || !startedAyah || 
      !finishedSurah || !finishedAyah ||  
      !timeStarted || !timeFinished
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const log = await prisma.progressLog.create({
      data: {
        userId,
        juz,
        startedSurah, 
        startedAyah, 
        finishedSurah, 
        finishedAyah,  
        timeStarted: new Date(timeStarted),
        timeFinished: new Date(timeFinished),
      }
    });

    return res.status(201).json({ message: "Log has been sent", data: log });

  } catch (err) {
    console.error("receiveData error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { receiveData };