import { NextFunction, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'
require('dotenv').config()

const createToken = (id: any) => {
    return jwt.sign({ id }, process.env.SECRET as Secret, { expiresIn: '3d' })
}

export const loginUser = async (req: Request, res: Response) => {
    const prisma = new PrismaClient()
    let success = false
    let user = {}
    let message = ''
    let authToken = ''

    try {
        const { email, password } = req.body
        const account = await prisma.account.findFirst({
            where: {
                email,
            }
        })
        if (account && bcrypt.compareSync(password, account.password)) {
            try {
                const dbUser = await prisma.user.findFirst({
                    where: {
                        accountId: account.id
                    }
                })
                if (dbUser) {
                    success = true
                    user = {
                        email: account.email,
                        username: dbUser.username,
                        firstName: dbUser.firstName,
                        lastName: dbUser.lastName,
                        avatar: dbUser.avatar,
                        userId: dbUser.id,
                    }
                    message = 'Login successful'
                    authToken = createToken(account.id)
                } else {
                    message = 'User not found'
                }
            } catch (error) {
                message = 'Error occured white verifyng user' + error
            }
        }
    } catch (error) {
        message = 'Error occured white verifyng account' + error
    } finally {
        await prisma.$disconnect()
        res.json({ success, user, message, authToken })
    }
}

export const loginGoogle = async (req: Request, res: Response) => {
    const prisma = new PrismaClient()
    let success = false
    let user = {}
    let message = ''
    let authToken = ''

    try {
        const token = req.body.token
        const email = token.email
        const password = token.sub
        const account = await prisma.account.findFirst({
            where: {
                email,
            }
        })
        if (account && bcrypt.compareSync(password, account.password)) {
            try {
                const dbUser = await prisma.user.findFirst({
                    where: {
                        accountId: account.id
                    }
                })
                if (dbUser) {
                    success = true
                    user = {
                        email: account.email,
                        username: dbUser.username,
                        firstName: dbUser.firstName,
                        lastName: dbUser.lastName,
                        avatar: dbUser.avatar,
                        userId: dbUser.id,
                    }
                    message = 'Login successful'
                    authToken = createToken(account.id)
                } else {
                    message = 'User not found'
                }
            } catch (error) {
                message = 'Error occured white verifyng user' + error
            }
        }
    } catch (error) {
        message = 'Error occured white verifyng account' + error
    } finally {
        await prisma.$disconnect()
        res.json({ success, user, message, authToken })
    }
}



export const registerUser = async (req: Request, res: Response) => {
    const prisma = new PrismaClient()
    let success = false
    let user = {}
    let message = ''
    let authToken = ''

    try {
        const { firstName, lastName, username, email, password } = req.body
        const account = await prisma.account.findFirst({
            where: {
                email
            }
        })
        if (account) {
            message = 'Email already registered'
        } else {
            let hashedPassword = await bcrypt.hash(password, 10)
            await prisma.account.create({
                data: {
                    email,
                    password: hashedPassword
                }
            }).then(async (newAccount: any) => {
                await prisma.user.create({
                    data: {
                        username,
                        firstName,
                        lastName,
                        avatar: '',
                        accountId: newAccount.id,
                    }
                }).then(() => {
                    success = true
                    user = {
                        email,
                        username,
                        firstName,
                        lastName,
                        avatar: '',
                        userId: newAccount.id,
                    }
                    message = 'Registration successful'
                    authToken = createToken(newAccount.id)
                }).catch((error: any) => {
                    prisma.account.delete({
                        where: {
                            email
                        }
                    })
                    message = 'Registration failed: ' + error
                })
            }).catch((error: any) => {
                message = 'Registration failed: ' + error
            })

        }
    } catch (error) {
        message = 'Registration failed: ' + error
    } finally {
        await prisma.$disconnect()
        res.json({ success, user, message, authToken })
    }
}

export const registerGoogle = async (req: Request, res: Response) => {
    const prisma = new PrismaClient()
    let success = false
    let user = {}
    let message = ''
    let authToken = ''

    try {
        const token = req.body.token

        const account = await prisma.account.findFirst({
            where: {
                email: token.email
            }
        })
        if (account) {
            message = 'Email already registered'
        } else {
            const firstName = token.given_name || ''
            const lastName = token.family_name || ''
            const username = token.email
            const email = token.email
            const password = token.sub
            const avatar = token.picture

            let hashedPassword = await bcrypt.hash(password, 10)

            await prisma.account.create({
                data: {
                    email,
                    password: hashedPassword
                }
            }).then(async (newAccount: any) => {
                await prisma.user.create({
                    data: {
                        username,
                        firstName,
                        lastName,
                        avatar,
                        accountId: newAccount.id,
                    }
                }).then(() => {
                    success = true
                    user = {
                        email,
                        username,
                        firstName,
                        lastName,
                        avatar,
                        userId: newAccount.id,
                    }
                    message = 'Registration successful'
                    authToken = createToken(newAccount.id)
                }).catch((error: any) => {
                    prisma.account.delete({
                        where: {
                            email
                        }
                    })
                    message = 'Registration failed: ' + error
                })
            }).catch((error: any) => {
                message = 'Registration failed: ' + error
            })

        }
    } catch (error) {
        message = 'Registration failed: ' + error
    } finally {
        await prisma.$disconnect()
        res.json({ success, user, message, authToken })
    }
}