import { Request, Response, NextFunction } from 'express'

export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) return next()
  else res.status(401).redirect('/auth/login')
}
