import { Router } from 'express'

import { authorization } from '../../middlewares/authorization'
import { adminAuthorization } from '../../middlewares/adminAuthorization'
import { logger } from '../../config/logger'

export const router = Router()

router.get('/', authorization, async (req, res) => {
  logger.petition(req)
  res.render('profile', {
    user: req.user,
    title: 'Tu Perfil'
  })
})
