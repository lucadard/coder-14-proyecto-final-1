import { Request, Response, NextFunction } from 'express'

// you need to add ?admin=true to the request url to have access to all the actions
export function authCheckMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return req.query.admin === 'true'
    ? next()
    : res.status(401).send({
        error: -1,
        descripcion: `ruta ${req.originalUrl} metodo ${req.method} no autorizado`
      })
}
