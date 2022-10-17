import { Router } from 'express'
import passport from 'passport'

export const router = Router()

//login
router.get('/login', (_, res) => {
  res.render('login', { title: 'Ingresá' })
})

router.post(
  '/login',
  passport.authenticate('login', {
    successRedirect: '/auth/login/success',
    failureRedirect: '/auth/login/fail'
  })
)

router.get('/login/success', (req, res) => {
  res.redirect('/')
})

router.get('/login/fail', (req, res) => {
  res.render('login', {
    title: 'Ingresá',
    msg: 'Ocurrio un error'
  })
})

//register
router.get('/register', (_, res) => {
  res.render('register', { title: 'Registrate' })
})

router.post(
  '/register',
  passport.authenticate('register', {
    successRedirect: '/auth/register/success',
    failureRedirect: '/auth/register/fail'
  })
)

router.get('/register/success', (req, res) => {
  res.redirect('/')
})

router.get('/register/fail', (req, res) => {
  res.render('register', {
    title: 'Registrate',
    msg: 'Ocurrio un error'
  })
})

//logout
router.get('/logout', (req, res) => {
  if (req.isAuthenticated()) {
    req.logout((err) => res.status(200).redirect('/'))
  }
})
