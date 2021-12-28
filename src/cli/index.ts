import { Command } from "commander"
import * as md5 from 'crypto-js/md5';


const program = new Command()
program
  .requiredOption("-s --script <script...>", "specify script")
  .option("-c, --cache", "use cache")
  .option("-r, --reuse", "reuse cache for select")
  .option("-p, --path <path>", "specific workspace")
  .option("-i, --ignore", "ignore option")
  .option("-t, --type <type>", "app type for write cache file")

program.parse(process.argv)
const options = program.opts()
global.itaroWorkspace = options.path
options.pad = md5(`${options.type ?? ''}${options.path ?? ''}`).toString()

/* eslint-disable */
// 必须使用require，动态加载，由于路径变量都是作为常量定义，所以在加载前需要预设好itaroWorkspace
const actions = require("./action")

actions.process(options)
