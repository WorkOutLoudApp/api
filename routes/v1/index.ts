import { Router } from 'express'
import exampleRouter from './example/example.router'

const router = Router({ mergeParams: true })

router.use('/example', exampleRouter)

export default router