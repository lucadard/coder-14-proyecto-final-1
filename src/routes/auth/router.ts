import { Router } from 'express'
import passport from 'passport'
import { logger } from '../../config/logger'

export const router = Router()

//login
router.get('/login', (req, res) => {
  logger.petition(req)
  res.render('login', { title: 'Ingresá' })
})

router.post(
  '/login',
  passport.authenticate('login', {
    successRedirect: '/auth/login/success',
    failureRedirect: '/auth/login/fail'
  }),
  (req) => logger.petition(req)
)

router.get('/login/success', (req, res) => {
  logger.petition(req)
  res.redirect('/')
})

router.get('/login/fail', (req, res) => {
  logger.petition(req)
  res.render('login', {
    title: 'Ingresá',
    msg: 'Ocurrio un error'
  })
})

//register
router.get('/register', (req, res) => {
  logger.petition(req)
  res.render('register', { title: 'Registrate' })
})

router.post(
  '/register',
  passport.authenticate('register', {
    successRedirect: '/auth/register/success',
    failureRedirect: '/auth/register/fail'
  }),
  (req) => logger.petition(req)
)

router.get('/register/success', (req, res) => {
  logger.petition(req)
  res.redirect('/')
})

router.get('/register/fail', (req, res) => {
  logger.petition(req)
  res.render('register', {
    title: 'Registrate',
    msg: 'Ocurrio un error'
  })
})

//logout
router.get('/logout', (req, res) => {
  logger.petition(req)
  if (req.isAuthenticated()) {
    req.logout((err) => res.status(200).redirect('/'))
  }
})
