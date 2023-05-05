import { errorHandler } from '@src/middlewares'
import v1Router from '@src/routes/v1.router'
import express, { Request, Response } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()
const port = process.env.PORT || 4000
const dev = process.env.NODE_ENV !== 'production'

// Middlewares
app.use(helmet())
if (dev) app.use(morgan('dev'))

// Routes
app.use('/api/v1', v1Router)

// For AWS ECS to know health of API
app.get("/api/healthcheck", (req, res) => {
  res.sendStatus(200);
});

// Error Handling
app.use((req: Request, res: Response) => {
  res.status(404).send('Not Found')
})

app.use(errorHandler)

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`)
})
