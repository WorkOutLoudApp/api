import v1Router from './v1';
import bodyParser from 'body-parser';
import { devOrigins } from '../utils/config/cors.config'
import cors from 'cors';
import { Router } from 'express'

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
router.use('/v1', v1Router)

export default router