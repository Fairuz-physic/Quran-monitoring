import { error } from 'node:console';
import { prisma } from '../config/db.js';
import { generateToken } from '../utils/generateToken.js';
import bycrypt from 'bcryptjs';

const login = async (req, res) =>{
    const { email, password }  = req.body;

    const findUser = await prisma.user.findUnique({
        where :{
            email : email
        }
    })

    if (!findUser){
        return res.status(400).json({error : "email or password is incorrect"});
    }

    const isMatch = await bycrypt.compare(password, findUser.passwordHash);

    if(!isMatch){
        return res.status(400).json({error : "email or password is incorrect"});
    }

    const token = generateToken(findUser.id, res); 

    res.status(201).json({
        status : 'success',
        data :{
            user :{
                id : findUser.id,
                email : email,
                role : findUser.role
            },
            token : token
        }
    })

}

export { login };