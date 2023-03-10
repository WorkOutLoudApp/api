import { NextFunction, Request, RequestHandler, Response } from 'express'

export const getHello: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json({ message: `Hello World from WoL API! ${new Date(Date.now()).toString()}` })
  } catch (err) {
    return next(err)
  }
}