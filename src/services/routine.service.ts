import { PrismaClient } from '@prisma/client'

const getRoutines = async (userId: number) => {
    const prisma = new PrismaClient()
    try {
        const routines = await prisma.routine.findMany({
            where: {
                userId
            },
            include: {
                exercises: true
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
                userId,
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

const addViewCount = async (routineId: number) => {
    const prisma = new PrismaClient()
    try {
        await prisma.routine.update({
            where: {
                id: routineId
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })
    } catch (error) {
        return null
    } finally {
        await prisma.$disconnect()
    }
}

const addRoutine = async (userId: number, name: string, description: string) => {
    const prisma = new PrismaClient()
    try {
        const routine = await prisma.routine.create({
            data: {
                name,
                description,
                userId
            }
        })
        return routine
    } catch (error) {
        return null
    } finally {
        await prisma.$disconnect()
    }
}

const deleteRoutine = async (userId: number, routineId: number) => {
    const prisma = new PrismaClient()
    try {
        console.log(routineId)
        const routine = await getRoutine(userId, routineId)
        if (!routine) return null
        const exercises = await getExercises(routineId)
        if (exercises && exercises.length > 0) {
            await prisma.exercise.deleteMany({
                where: {
                    routineId
                }
            })
        }
        await prisma.routine.delete({
            where: {
                id: routineId
            }
        })
        return true
    } catch (error) {
        console.log(error)
        return null
    } finally {
        await prisma.$disconnect()
    }
}

const favoriteRoutine = async (routineId: number) => {
    const prisma = new PrismaClient()
    try {
        const routine = await prisma.routine.findFirst({
            where: {
                id: routineId
            }
        })
        if (!routine) return null
        const updatedRoutine = await prisma.routine.update({
            where: {
                id: routineId
            },
            data: {
                isFavorite: !routine.isFavorite
            }
        })
        return updatedRoutine
        return null
    } finally {
        await prisma.$disconnect()
    }
}

const getExercises = async (routineId: number) => {
    const prisma = new PrismaClient()
    try {
        const routines = await prisma.exercise.findMany({
            where: {
                routineId
            }
        })
        return routines
    } catch (error) {
        return null
    } finally {
        await prisma.$disconnect()
    }
}

const addExercise = async (userId: number, routineId: number, name: string, description: string, reps: number, sets: number, rest: number, image?: string, bodyPart?: string, equipment?: string, target?: string) => {
    const prisma = new PrismaClient()
    try {
        const exercise = await prisma.exercise.create({
            data: {
                name,
                description,
                reps: reps || 1,
                sets: sets || 1,
                rest: rest || 30,
                image,
                bodyPart,
                equipment,
                target,
                routineId
            }
        })
        return exercise
    } catch (error) {
        return null
    } finally {
        await prisma.$disconnect()
    }
}

const editExercise = async (userId: number, routineId: number, exerciseId: number, name: string, description: string, reps: number, sets: number, rest: number, image?: string, bodyPart?: string, equipment?: string, target?: string) => {
    const prisma = new PrismaClient()
    try {
        const exercise = await prisma.exercise.update({
            where: {
                id: exerciseId
            },
            data: {
                name,
                description,
                reps: reps || 1,
                sets: sets || 1,
                rest: rest || 30,
                image,
                bodyPart,
                equipment,
                target,
            }
        })
        return exercise
    } catch (error) {
        console.log(error)
        return null
    } finally {
        await prisma.$disconnect()
    }
}

const deleteExercise = async (exerciseId: number) => {
    const prisma = new PrismaClient()
    try {
        await prisma.exercise.delete({
            where: {
                id: exerciseId
            }
        })
        return true
    } catch (error) {
        return null
    } finally {
        await prisma.$disconnect()
    }
}

const getFavorites = async (userId: number) => {
    const prisma = new PrismaClient()
    try {
        const favorites = await prisma.routine.findMany({
            where: {
                userId,
                isFavorite: true
            },
            orderBy: {
                name: 'asc'
            }
        })
        return favorites
    } catch (error) {
        return null
    } finally {
        await prisma.$disconnect()
    }
}

const getAllExercises = async (userId: number) => {
    const prisma = new PrismaClient()
    try {
        const exercises = await prisma.exercise.findMany({
            where: {
                routine: {
                    userId
                }
            },
            distinct: ['name']
        })
        return exercises
    } catch (error) {
        return null
    } finally {
        await prisma.$disconnect()
    }
}

const getPopularRoutines = async (userId: number) => {
    const prisma = new PrismaClient()
    try {
        const routines = await prisma.routine.findMany({
            where: {
                userId: {
                    not: userId
                },
                views: {
                    gt: 0
                }
            },
            include: {
                exercises: true,
                user: true
            },
            orderBy: {
                views: 'desc'
            }
        })
        return routines
    } catch (error) {
        return null
    } finally {
        await prisma.$disconnect()
    }
}

export default {
    getRoutines,
    getRoutine,
    addRoutine,
    deleteRoutine,
    favoriteRoutine,
    getExercises,
    addExercise,
    deleteExercise,
    editExercise,
    getFavorites,
    getAllExercises,
    addViewCount,
    getPopularRoutines
}