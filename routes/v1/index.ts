import { Router } from 'express'
import dbRouter from './db/db.router'
import exampleRouter from './example/example.router'

const router = Router({ mergeParams: true })

router.use('/example', exampleRouter)
router.use('/db', dbRouter)

export default router