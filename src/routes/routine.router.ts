import { Router } from 'express'
import {
    getRoutines,
    getRoutine,
    addRoutine,
    favoriteRoutine,
    deleteRoutine,
    addExercise,
    deleteExercise,
    editExercise,
    getExercises,
    getFavorites,
    getAllExercises,
    getPopularRoutines
} from "@src/controllers/routine.controller"
import { requireAuth } from '@src/middlewares/requireAuth'

const router = Router({ mergeParams: true })
router.use(requireAuth)
router.get('/getRoutines', getRoutines)
router.get('/getPopularRoutines', getPopularRoutines)
router.post('/add', addRoutine)
router.get('/:id/get', getRoutine)
router.patch('/:id/favorite', favoriteRoutine)
router.get('/:id/delete', deleteRoutine)
router.get('/:id/getExercises', getExercises)
router.post('/:id/addExercise', addExercise)
router.get('/:id/deleteExercise', deleteExercise)
router.post('/:id/editExercise', editExercise)
router.get('/getFavorites', getFavorites)
router.get('/getAllExercises', getAllExercises)

export default router