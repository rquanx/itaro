import { Command } from "commander"

const program = new Command()
program
  .requiredOption("-s --script <script...>", "specify script")
  .option("-c, --cache", "use cache")
  .option("-r, --reuse", "reuse cache for select")
  .option("-p, --path <path>", "specific workspace")
  .option("-i, --ignore", "ignore option")

program.parse(process.argv)
const options = program.opts()
global.itaroWorkspace = options.path

/* eslint-disable */
// 必须使用require，动态加载，由于路径变量都是作为常量定义，所以在加载前需要预设好itaroWorkspace
const actions = require("./action")

actions.process(options)
