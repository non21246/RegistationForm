import { createUser, getUserByEmail } from '../db/user';
import express from 'express';
import { random, authentication } from '../helpers';


export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {firstname, lastname, email, password} = req.body;
        if(!firstname || !lastname || !email || !password ){
            return res.status(400).json({ error: 'Bad Request: Missing required fields' });
        }

        const existingUser = await getUserByEmail(email);
        if(existingUser){
            return res.status(400).json({ error: 'Bad Request: Email already exists' });

        }

        const salt = random();
        const user = await createUser({
            email,
            firstname,
            lastname,
            authentication:{salt, password: authentication(salt, password)},
        });
        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}