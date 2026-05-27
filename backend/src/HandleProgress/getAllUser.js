import { prisma } from "../config/db.js";
export const getAllUser = async(req,res)=>{
   try{

      const users = await prisma.user.findMany({
         where:{
            role:"USER"
         }
      })

      res.json({
         success:true,
         data:users
      })

   }catch(err){

      console.log(err)

      res.status(500).json({
         success:false,
         message:err.message
      })
   }
}