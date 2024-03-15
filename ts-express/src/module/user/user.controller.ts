import express, { NextFunction, Request, Response, json } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import  { newUserData } from './user.logic'

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
        const newUser = await db.create({
            data: {
                ...newUserData(req.body)
            },
        })
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        console.log('eiei')
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

