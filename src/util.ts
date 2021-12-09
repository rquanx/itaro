import { red } from "chalk"

export const getPathArgs = () => {
  const pathIndex = process.argv.findIndex((v) => v === "--path")
  if (pathIndex > -1) {
    const pathArgs = process.argv.splice(pathIndex, 2)
    if (pathArgs.length < 2) {
      console.log(red("[itaro]：无效的path参数"))
      process.exit(1)
    }
    return pathArgs
  }
  return []
}
