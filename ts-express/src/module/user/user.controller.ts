import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const db = prisma.user

export async function getAll(req: Request, res: Response) {
    try {
        res.send('eiei')
    } catch (error) {
        console.log(error)
        res.status(404).send('error')
    }
}

export async function create(req: Request, res: Response) {
    try {
        const data = req.body
    } catch (error) {
        console.log(error)
        res.status(404).send('error')
    }
}

export async function update(req: Request, res: Response) {
    try {
        const data = req.body
    } catch (error) {
        console.log(error)
        res.status(404).send('error')
    }
}

