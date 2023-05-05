import { NextFunction, Request, Response } from 'express'

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err)
  next(err)
  return res.status(500).send('Internal Error')
}
