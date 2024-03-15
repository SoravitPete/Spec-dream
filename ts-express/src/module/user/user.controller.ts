import express, { NextFunction, Request, Response, json } from 'express'
import { PrismaClient } from '@prisma/client'
import  { newUserData } from './user.logic'

const prisma = new PrismaClient()

const db = prisma.user

export async function getAll(req: Request, res: Response) {
    try {
        const allUser = await db.findMany()
        res.status(201).json(allUser)
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
        const { data } = req.body
        const updateUser = await db.update({
            where: {
                id: data.id
            },
            data: data
        })
        res.status(201).json(updateUser)
    } catch (error) {
        console.log(error)
        res.status(404).send('error')
    }
}

