import express, { NextFunction, Request, Response, json } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import  { newThreadData } from './thread.logic'

const prisma = new PrismaClient()

const db = prisma.thread

const getQuery = (req: Request): Prisma.ThreadFindManyArgs => {
    const {
        title,
        context
    } = req.query;

    let query: Prisma.ThreadFindManyArgs = {};

    if (title) query = { ...query, where: { title: String(title) } };
    if (context) query = { ...query, where: { context: String(title) } };

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
        const newThread = await db.create({
            data: {
                ...newThreadData(req.body)
            },
        })
        res.status(201).json(newThread);
    } catch (error) {
        console.error(error);
        console.log('eiei')
        res.status(500).send('Internal Server Error');
    }
}

export async function update(req: Request, res: Response) {
    try {
        const { id } = req.params
        const updateThread = await db.update({
            where: {
                id
            },
            data: req.body
        })
        res.status(201).json(updateThread)
    } catch (error) {
        console.log(error)
        res.status(404).send('error')
    }
}

export async function deleteID(req: Request, res: Response) {
    try {
        const {id } = req.params
        const deleteThread = await db.delete({
            where: {
                id
            },
        })
        res.status(201).json(deleteThread)
    } catch (error) {
        console.log(error)
        res.status(404).send('error')
    }
}
