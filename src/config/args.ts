import parseArgs from 'minimist'

type arguments = {
  port: number
  mode: 'cluster' | 'fork'
}

const argumentsObject = parseArgs<arguments>(process.argv.slice(2))

if (!argumentsObject.port) argumentsObject.port = 8080
if (!argumentsObject.mode || argumentsObject.mode !== 'cluster')
  argumentsObject.mode = 'fork'

export { argumentsObject }
