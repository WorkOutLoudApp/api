import { Router } from 'express'
import { getExample } from '@src/controllers/example.controller'

const router = Router({ mergeParams: true })

router.use('/hello', getExample)

export default router
