import { prisma } from "../config/db.js";

const getProgress = async (req, res) =>{
    try{
        const { Id } = req.params
        const data = await prisma.progressLog.findMany({
            where:{
                userId : Id
            }
        })
        if(!data){
            res.status(404).json({
                message : "data is not found"
            })
        }

        return res.status(200).json({
            message : 'succes getting progress data',
            data
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            message : 'Internal server error'
        })
    }
}

export { getProgress }