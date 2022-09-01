import express from 'express'
const app = express()

app.get('/', (req, res) => {
})

const PORT = 8080

app.listen(PORT, () => {
  console.log(`conectado al puerto: ${PORT}`)
})
