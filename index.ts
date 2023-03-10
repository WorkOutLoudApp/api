import express, { Request, Response } from "express";
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares'
import apiRouter from './routes/api.router'

const app = express();
const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'

// Middlewares
app.use(helmet())
if (dev) app.use(morgan('dev'))


// Routes
app.use('/api', apiRouter)

app.use((req: Request, res: Response) => {
  res.status(404).send('Not Found')
})
app.use(errorHandler)

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`)
})


