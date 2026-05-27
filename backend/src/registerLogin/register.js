import { prisma } from '../config/db.js';
import bycrypt from 'bcryptjs'
import { generateToken } from '../utils/generateToken.js';

const register = async (req, res)=>{
    const { name, email, password } = req.body;

    const salt = await bycrypt.genSalt(10);
    const passwordhash = await bycrypt.hash(password, salt);
    
    const findUnique = await prisma.user.findUnique({
        where : {
            email : email
        }
    });

    if(findUnique){
        return res.status(400).json({ error : "email already exists" });
    }

    const createUser = await prisma.user.create({
        data : {
            name : name,
            email : email,
            passwordHash : passwordhash
        }
    });

    const token = generateToken(createUser.id, res); 

    res.status(201).json({
        status : 'success',
        data :{
            user :{
                id : createUser.id,
                email : email,
            },
            token : token
        }
    })
}

export { register };