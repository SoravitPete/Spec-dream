import express, { NextFunction, Request, Response, json } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import  { newUserData } from './user.logic'
import { hashPassword } from '../../../util/passwordUtils';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const db = prisma.user

const getQuery = (req: Request): Prisma.UserFindManyArgs => {
    const {
        accountName,
        firstName,
        lastName,
        email,
        mobileNo,
        birthday,
    } = req.query;

    let query: Prisma.UserFindManyArgs = {};

    if (accountName) query = { ...query, where: { accountName: String(accountName) } };
    if (firstName) query = { ...query, where: { firstName: String(firstName) } };
    if (lastName) query = { ...query, where: { lastName: String(lastName) } };
    if (email) query = { ...query, where: { email: String(email) } };
    if (mobileNo) query = { ...query, where: { mobileNo: String(mobileNo) } };
    if (birthday) query = { ...query, where: { birthday: new Date(birthday as string) } };

    return query;
};

export async function getAll(req: Request, res: Response) {
    try {
        const query = getQuery(req)
        const getAllUser = await db.findMany(query)
        res.status(201).json(getAllUser)
    } catch (error) {
        console.log(error)
        res.status(404).send('error')
    }
}

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const userData = newUserData(req.body);

        console.log(userData.password)

        const hashedPassword = await hashPassword(userData.password);
        const hashedPassword2 = await hashPassword(userData.password);

        console.log(hashedPassword)
        console.log(hashedPassword2)

        const newUser = await prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
            },
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export async function update(req: Request, res: Response) {
    try {
        const { id } = req.params
        const updateUser = await db.update({
            where: {
                id
            },
            data: req.body
        })
        res.status(201).json(updateUser)
    } catch (error) {
        console.log(error)
        res.status(404).send('error')
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { accountName, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { accountName }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

