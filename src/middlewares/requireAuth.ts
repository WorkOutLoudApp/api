import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

require('dotenv').config()

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({error: 'Authorization token is required'})
    }


    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    const prisma = new PrismaClient()
    try {
        const { id } = jwt.verify(token, process.env.SECRET as Secret) as JwtPayload
        const account = await prisma.account.findFirst({
            where: {
                id
            }
        })
        if (account) {
            const user = await prisma.user.findFirst({
                where: {
                    accountId: id
                }
            })
            if (user) {
                res.locals.userId = user?.id
                next()
            }
        }
    } catch (error) {
        res.status(401).json({ error: 'Request is not authorized' })
    } finally {
        await prisma.$disconnect()
    }
}
