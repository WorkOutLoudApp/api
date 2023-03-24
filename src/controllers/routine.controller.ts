import { NextFunction, Request, RequestHandler, Response } from 'express'
import routineService from '../services/routine.service'

export const getRoutines: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const routines = await routineService.getRoutines(1)
        if (!routines) return res.status(400).json({ message: 'Error getting routines' })
        return res.json(routines)
    } catch (err) {
        return next(err)
    }
}

export const getRoutine: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params
        const routine = await routineService.getRoutine(1, parseInt(id, 10))
        if (!routine) return res.status(400).json({ message: 'Error getting routine' })
        return res.json(routine)
    } catch (err) {
        return next(err)
    }
}

export const addRoutine: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, description } = req.body
        if (!name) return res.status(400).json({ message: 'Missing "name"' })
        if (!description) return res.status(400).json({ message: 'Missing "description"' })

        const routine = await routineService.addRoutine(name, description)
        if (!routine) return res.status(400).json({ message: 'Error creating routine' })
        return res.json(routine)
    } catch (err) {
        return next(err)
    }
}

// export const getExercises: RequestHandler = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const { id } = req.params
//         const routines = await routineService.getExercises(parseInt(id, 10))
//         if (!routines) return res.status(400).json({ message: 'Error getting routines' })
//         return res.json(routines)
//     } catch (err) {
//         return next(err)
//     }
// }

// export const addExercise: RequestHandler = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const { id } = req.params
//         const { name, description } = req.body
//         if (!name) return res.status(400).json({ message: 'Missing "name"' })
//         if (!description) return res.status(400).json({ message: 'Missing "description"' })

//         const exercise = await routineService.addExercise(1, parseInt(id, 10), name, description)
//         if (!exercise) return res.status(400).json({ message: 'Error creating exercise' })
//         return res.json(exercise)
//     } catch (err) {
//         return next(err)
//     }
// }
