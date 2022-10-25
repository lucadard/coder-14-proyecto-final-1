const calculate = (amount) => {
  // const randoms: { [key: string]: number } = {}
  const randoms = {}

  const startTime = performance.now()
  for (let i = 0; i < amount; i++) {
    const randomNumber = Math.ceil(Math.random() * (1000 + 1) - 1)
    if (randoms[randomNumber]) randoms[randomNumber]++
    else randoms[randomNumber] = 1
  }
  const endTime = performance.now()

  return {
    randoms,
    time: `in ${((endTime - startTime) / 1000).toFixed(3)}s`
  }
}

process.on('message', (amount) => {
  const randoms = calculate(amount)
  process.send(randoms)
})

process.send('ready')
