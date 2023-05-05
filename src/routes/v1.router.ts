import webRouter from '@src/routes/web'
import bodyParser from 'body-parser'
import { devOrigins } from '@src/utils/config/cors.config'
import cors from 'cors'
import { Router, Request, Response } from 'express'
import userRouter from '@src/routes/user.router'
import requireAuthRouter from '@src/routes/auth.router'
import routineRouter from '@src/routes/routine.router'
import postRouter from '@src/routes/post.router'

require('dotenv').config()

const router = Router()
const dev = process.env.NODE_ENV !== 'production'

// Middlewares
router.use(
  cors({
    origin: dev ? devOrigins : '',
    credentials: true,
  })
)
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// Routes
router.use('/web', webRouter)
router.use('/user', userRouter)
router.use('/routine', routineRouter)
router.use('/post', postRouter)
router.use('/auth', requireAuthRouter)

router.get('/key/google', (req: Request, res: Response) => {
  res.send({ key: process.env.PUBLIC_GOOGLE_API_TOKEN })
})

export default router
