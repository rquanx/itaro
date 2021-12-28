import * as fs from "fs"
import { AppConfig } from "@tarojs/taro"
import { searchListByName } from "./util"
import { answerPagesPath, appConfigCachePath, ITARO_ENV } from "../constants"
import {
  PageList,
  PageValue,
  MainPageType,
  SubpackageRoot,
  PageType,
  SubpackageItem,
  getTabBarPages,
} from "./appConfig"

/* eslint-disable */
const write = require("write")
// 获取页面列表
export function getPagesSource(searchList: PageList) {
  return (_x: any, input: string = "") => {
    return Promise.resolve(searchListByName(input, searchList))
  }
}

// 检测 pages 选项是否合法
export function validatePages(appConfig: AppConfig) {
  const tabBarPages = getTabBarPages(appConfig)
  return (pages: any[]) => {
    return !tabBarPages.length && !pages.length ? "至少选择一个页面" : true
  }
}

// 主包内容
export function getAnswerMainPages(
  answerPages: PageValue[] = [],
  tabBarPages: string[]
) {
  const mainPages =
    answerPages
      .filter((item) => item.type === PageType.MAIN_PAGE)
      .map((item) => (item as MainPageType).value) || []
  return [...tabBarPages, ...mainPages]
}

// 获取 subPackages
export function getAnswerSubPackages(answerPages: PageValue[] = []) {
  // 选择了 root 的 subPackages
  const subPackages =
    answerPages
      ?.filter((item) => item.type === PageType.SUBPACKAGE_ROOT)
      .map((item) => (item as SubpackageRoot).value) || []
  const selectedRoots = subPackages.map((item) => item.root)

  // 选择分包里的 pages 页面
  const subPackages2 = answerPages
    ?.filter(
      (item) =>
        item.type === PageType.SUBPACKAGE_ITEM &&
        !selectedRoots.includes(item.root.root)
    )
    .reduce((acc: Record<string, Taro.SubPackage>, cur: SubpackageItem) => {
      const { root, value } = cur
      if (!acc[root.root]) {
        root.pages = []
        const key = root.root
        acc[key] = root
      }
      acc[root.root].pages.push(value)
      return acc
    }, {})

  return [...subPackages, ...Object.values(subPackages2 || {})]
}

// 获取回答的 AppConfig
export function getAnswerAppConfig(
  originAppConfig: AppConfig,
  answerPages: PageValue[] = []
): AppConfig {

  const tabBarPages = getTabBarPages(originAppConfig)

  // 更新主页面信息
  originAppConfig.pages = getAnswerMainPages(answerPages, tabBarPages)

  // 更新子包信息信息
  const subpackages = getAnswerSubPackages(answerPages)

  // 删除原主包信息
  delete originAppConfig.subpackages
  delete originAppConfig.subPackages

  if (subpackages.length) {
    originAppConfig.subpackages = subpackages
  }

  return originAppConfig
}

// 设置 app.config 的环境变量
export function setAppConfigEnv(appConfig: AppConfig) {
  process.env[ITARO_ENV] = JSON.stringify(appConfig, null, 2)
}

// 写入 app.config.json
export function writeAppConfig(appConfig: AppConfig, pad?: string): void {
  setAppConfigEnv(appConfig)
  write.sync(appConfigCachePath(pad), JSON.stringify(appConfig, null, 2))
}

export function writeAnswerPages(
  pages: PageValue[] | undefined,
  pad?: string
) {
  write.sync(answerPagesPath(pad), JSON.stringify(pages ?? []))
}

export function readAnswerPages(pad?: string) {
  const p = answerPagesPath(pad)
  if (fs.existsSync(p)) {
    return JSON.parse(fs.readFileSync(p, "utf-8"))
  }
  return []
}

// 判断是否有 answer 的缓存
export function hasAnswerPagesCache(pad?: string) {
  return fs.existsSync(answerPagesPath(pad))
}

// 设置 app.config 的环境变量
export function setAppConfigEnvFormCache(pad?: string) {
  process.env[ITARO_ENV] = readAppConfigFile(pad)
}

// 读取文件
export function readAppConfigFile(pad?: string) {
  const p = appConfigCachePath(pad)
  if (fs.existsSync(p)) {
    return fs.readFileSync(p, "utf-8")
  }
}

export interface AnswersResult {
  cache?: boolean
  pages?: PageValue[]
  reuseCache?: boolean
}
export function processAnswers(
  appConfig: AppConfig,
  answers: AnswersResult,
  pad?: string
) {
  // 如果使用缓存，则无需做任何处理
  if (!answers.cache) {
    // app.config 处理
    const answerAppConfig = getAnswerAppConfig(appConfig, answers.pages)
    writeAnswerPages(answers.pages, pad)
    writeAppConfig(answerAppConfig, pad)
  } else {
    setAppConfigEnvFormCache(pad)
  }
}
