import { Router } from 'express'
import routineRouter from './routine/routine.router'
import exampleRouter from './example/example.router'

const router = Router({ mergeParams: true })

router.use('/example', exampleRouter)
router.use('/routine', routineRouter)

export default router