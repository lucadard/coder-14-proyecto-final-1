import { engine } from 'express-handlebars'
import path from 'path'

export const hbsConfig = engine({
  extname: '.hbs',
  defaultLayout: path.join(__dirname, '../views/layouts/main.hbs'),
  layoutsDir: path.join(__dirname, '../views/layouts')
})
