import { Router, Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'

require('dotenv').config()

const router = Router({ mergeParams: true })
router.get('/verifyToken', (req: Request, res: Response) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token is required' })
  }

  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).send('Unauthorized')
  }

  jwt.verify(token, process.env.SECRET as Secret, (error, decodedToken) => {
    if (error) {
      res.json({ success: false, error: error })
    } else {
      res.json({ success: true })
    }
  })

})

export default router