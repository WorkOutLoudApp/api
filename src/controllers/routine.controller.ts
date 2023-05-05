import { NextFunction, Request, RequestHandler, Response } from 'express'
import routineService from '@src/services/routine.service'

export const getRoutines: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {userId} = res.locals
        if (!userId) return res.status(400).json({message: 'No user id'})
        const routines = await routineService.getRoutines(userId)
        if (!routines) return res.status(400).json({message: 'Error getting routines'})
        return res.json(routines)
    } catch (err) {
        return next(err)
    }
}, getRoutine: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {id} = req.params
        const {owner} = req.query
        const {userId} = res.locals
        if (!userId) return res.status(400).json({message: 'No user id'})
        const routine = await routineService.getRoutine(parseInt(owner || userId, 10), parseInt(id, 10))
        if (!routine) return res.status(400).json({message: 'Error getting routine'})
        res.json({
            routine,
            userId
        })
        console.log(owner, userId)
        if (owner && parseInt(owner as string, 10) !== userId) {
            console.log('hi')
            await routineService.addViewCount(parseInt(id, 10))
        }
        // eslint-disable-next-line consistent-return
        return
    } catch (err) {
        return next(err)
    }
}, addRoutine: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {userId} = res.locals
        if (!userId) return res.status(400).json({message: 'No user id'})
        const {name, description} = req.body
        if (!name) return res.status(400).json({message: 'Missing "name"'})
        if (!description) return res.status(400).json({message: 'Missing "description"'})

        const routine = await routineService.addRoutine(userId, name, description)
        if (!routine) return res.status(400).json({message: 'Error creating routine'})
        return res.json(routine)
    } catch (err) {
        return next(err)
    }
}, deleteRoutine: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {userId} = res.locals
        if (!userId) return res.status(400).json({message: 'No user id'})
        const {id} = req.params
        const deleted = await routineService.deleteRoutine(userId, parseInt(id, 10))
        if (!deleted) return res.status(400).json({message: 'Error deleting routine'})
        return res.json(deleted)
    } catch (err) {
        return next(err)
    }
}, favoriteRoutine: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {id} = req.params

        const routine = await routineService.favoriteRoutine(parseInt(id, 10))
        if (!routine) return res.status(400).json({message: 'Error favoriting routine'})
        return res.json(routine)
    } catch (err) {
        return next(err)
    }
}, getExercises: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {id} = req.params
        const routines = await routineService.getExercises(parseInt(id, 10))
        if (!routines) return res.status(400).json({message: 'Error getting routines'})
        return res.json(routines)
    } catch (err) {
        return next(err)
    }
}, addExercise: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {id} = req.params
        const {name, description, reps, sets, rest, image, bodyPart, equipment, target} = req.body
        if (!name) return res.status(400).json({message: 'Missing "name"'})
        if (!description) return res.status(400).json({message: 'Missing "description"'})

        const exercise = await routineService.addExercise(1, parseInt(id, 10), name, description, reps, sets, rest, image, bodyPart, equipment, target)
        if (!exercise) return res.status(400).json({message: 'Error creating exercise'})
        return res.json(exercise)
    } catch (err) {
        return next(err)
    }
}, deleteExercise: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {id} = req.params

        const deleted = await routineService.deleteExercise(parseInt(id, 10))
        if (!deleted) return res.status(400).json({message: 'Error deleting exercise'})
        return res.json(deleted)
    } catch (err) {
        return next(err)
    }
}, editExercise: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {id} = req.params
        const {exerciseId, name, description, reps, sets, rest, image, bodyPart, equipment, target} = req.body
        if (!name) return res.status(400).json({message: 'Missing "name"'})
        if (!description) return res.status(400).json({message: 'Missing "description"'})

        const exercise = await routineService.editExercise(1, parseInt(id, 10), exerciseId, name, description, reps, sets, rest, image, bodyPart, equipment, target)
        if (!exercise) return res.status(400).json({message: 'Error creating exercise'})
        return res.json(exercise)
    } catch (err) {
        return next(err)
    }
}, getFavorites: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {userId} = res.locals
        if (!userId) return res.status(400).json({message: 'No user id'})
        const favorites = await routineService.getFavorites(userId)
        if (!favorites) return res.status(400).json({message: 'Error getting favorites'})
        return res.json(favorites)
    } catch (err) {
        return next(err)
    }
}, getAllExercises: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {userId} = res.locals
        if (!userId) return res.status(400).json({message: 'No user id'})
        const exercises = await routineService.getAllExercises(userId)
        if (!exercises) return res.status(400).json({message: 'Error getting exercises'})
        return res.json(exercises)
    } catch (err) {
        return next(err)
    }
}, getPopularRoutines: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {userId} = res.locals
        if (!userId) return res.status(400).json({message: 'No user id'})
        const routines = await routineService.getPopularRoutines(userId)
        if (!routines) return res.status(400).json({message: 'Error getting popular routines'})
        return res.json(routines)
    } catch (err) {
        return next(err)
    }
}



