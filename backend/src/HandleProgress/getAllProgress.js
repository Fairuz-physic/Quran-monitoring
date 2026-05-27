import { prisma } from "../config/db.js";
export const getAllProgress = async(req,res)=>{
   try{
    const logs = await prisma.progressLog.findMany({
        include:{
            user:{
                select:{
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                }
            }
        }
    });

      res.json({
        data : logs,
        success:true
      })

   }catch(err){

      console.log(err)

      res.status(500).json({
         success:false,
         message:err.message
      })
   }
}