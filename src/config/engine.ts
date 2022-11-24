import { engine } from 'express-handlebars'
import path from 'path'

const relativePath = process.env.NODE_ENV === 'production' ? '..' : '../..'

export const hbsConfig = engine({
  extname: '.hbs',
  defaultLayout: path.join(__dirname, `${relativePath}/views/layouts/main.hbs`),
  layoutsDir: path.join(__dirname, `${relativePath}/views/layouts`)
})
