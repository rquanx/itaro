import * as path from "path"
import * as fs from "fs"
import { red } from "chalk"

const { itaroWorkspace = "" } = global
const getRootDir = () => {
  return itaroWorkspace
    ? path.resolve(process.cwd(), itaroWorkspace)
    : process.cwd()
}

const getNodeModulesDir = () => {
  const paths = ["./", "../", "../../", "../../../"]
  let index = 0
  while (
    index < paths.length &&
    !fs.existsSync(
      path.resolve(
        rootDir,
        `${paths[index]}/node_modules/@tarojs/taro/package.json`
      )
    )
  ) {
    index++
  }
  if (index > paths.length - 1) {
    console.log(red("[itaro]：找不到有效的node_modules"))
    process.exit(1)
  }
  return path.resolve(rootDir, `${paths[index]}/node_modules`)
}

export const rootDir = getRootDir() // 可以指定目录
export const sourceDir = path.resolve(rootDir, "./src")

export const configPath = path.resolve(rootDir, "config/index.js")

// 多层级寻找node_modules
export const nodeModulesDir = getNodeModulesDir()
export const taroPackageJson = `${nodeModulesDir}/@tarojs/taro/package.json`

export const appConfigPath = path.resolve(sourceDir, "./app.config")
export const cacheDir = path.resolve(nodeModulesDir, "./.cache/itaro/")
export const appConfigCachePath = path.resolve(cacheDir, "./app.config.json")

export const answerPagesPath = path.resolve(cacheDir, "./answer-pages.json")
export const ITARO_ENV = "ITARO"
