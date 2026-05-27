import { prisma } from '../config/db.js';

const handleProgress = async (req, res) => {
    try {
        const {
            userId,
            approvedBy,
            timeStarted,
            timeFinished,
            startedSurah,
            juz,
            startedAyah,
            finishedSurah,
            finishedAyah,
            status,
        } = req.body;  

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId field is required"
            });
        }

        // save to database
        const createProgress = await prisma.ProgressLog.create({
            data: {
                userId : userId,
                approvedBy : approvedBy,
                timeStarted,
                timeFinished,
                startedSurah,
                juz,
                startedAyah,
                finishedSurah,
                finishedAyah,
                status,
                }
        });

        return res.status(200).json({
            success: true,
            message: "Progress received",
            data: createProgress
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export { handleProgress };