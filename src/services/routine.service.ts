import { PrismaClient } from '@prisma/client'

const getRoutines = async (userId: number) => {
    const prisma = new PrismaClient()
    try {
        const routines = await prisma.routine.findMany({
            where: {
                // userId
            }
        })
        return routines
    } catch (error) {
        return null
    } finally {
        await prisma.$disconnect()
    }
}

const getRoutine = async (userId: number, routineId: number) => {
    const prisma = new PrismaClient()
    try {
        const routine = await prisma.routine.findFirst({
            where: {
                // userId,
                id: routineId
            }
        })
        return routine
    } catch (error) {
        return null
    } finally {
        await prisma.$disconnect()
    }
}

const addRoutine = async (name: string, description: string) => {
    const prisma = new PrismaClient()
    try {
        const routine = await prisma.routine.create({
            data: {
                name,
                description,
            }
        })
        return routine
    } catch (error) {
        console.log(error)
        return null
    } finally {
        await prisma.$disconnect()
    }
}

// const getExercises = async (routineId: number) => {
//     const prisma = new PrismaClient()
//     try {
//         const routines = await prisma.exercise.findMany({
//             where: {
//                 routineId
//             }
//         })
//         return routines
//     } catch (error) {
//         return null
//     } finally {
//         await prisma.$disconnect()
//     }
// }

// const addExercise = async (userId: number, routineId: number, name: string, description: string) => {
//     const prisma = new PrismaClient()
//     try {
//         const exercise = await prisma.exercise.create({
//             data: {
//                 name,
//                 description,
//                 routineId
//             }
//         })
//         return exercise
//     } catch (error) {
//         return null
//     } finally {
//         await prisma.$disconnect()
//     }
// }

export default {
    getRoutines,
    getRoutine,
    addRoutine,
    // getExercises,
    // addExercise
}