import parseArgs from 'minimist'

type arguments = {
  port: number | undefined
  mode: 'cluster' | 'fork'
  i: number
}

const argumentsObject = parseArgs<arguments>(process.argv.slice(2))

if (!argumentsObject.port || isNaN(argumentsObject.port))
  argumentsObject.port = undefined

if (!argumentsObject.i || isNaN(argumentsObject.i)) argumentsObject.i = 5
else {
  if (argumentsObject.i < 2) argumentsObject.i = 2
}

if (!argumentsObject.mode || argumentsObject.mode !== 'cluster') {
  argumentsObject.mode = 'fork'
  argumentsObject.i = 1
}

export { argumentsObject }
