import { checkSetting } from "./util"
import * as inquirer from "inquirer"
import {
  getAppConfig,
  hasAppConfigCache,
  getPagesWithoutTabBarPages,
} from "./appConfig"
import {
  AnswersResult,
  validatePages,
  getPagesSource,
  readAnswerPages,
  hasAnswerPagesCache,
} from "./answer"
import PromptUI from "inquirer/lib/ui/prompt"

export type Question = (
  answer?: AnswersResult,
  extra?: Record<string, any>
) => Promise<AnswersResult> & {
  ui: PromptUI
}

/* eslint-disable */
inquirer.registerPrompt(
  "checkbox-plus",
  require("inquirer-checkbox-plus-prompt")
)
/* eslint-disable */
inquirer.registerPrompt("autocomplete", require("inquirer-autocomplete-prompt"))

// 检查命令
checkSetting()

export const useCacheQuestion: Question = (answer, extra) => {
  return inquirer.prompt<AnswersResult>(
    [
      {
        type: "confirm",
        message: "是否沿用上次配置？",
        name: "cache",
        when: () => hasAppConfigCache(extra?.pad),
      },
    ],
    answer
  )
}

export const reuseCacheQuestion: Question = (answer, extra) => {
  return inquirer.prompt<AnswersResult>(
    [
      {
        type: "confirm",
        message: "是否基于上次配置进行修改？",
        name: "reuseCache",
        when: () => hasAnswerPagesCache(extra?.pad) && answer?.cache !== true,
      },
    ],
    answer
  )
}

export const selectQuestion: Question = (answer, extra) => {
  if (answer?.cache === true) {
    return Promise.resolve(answer) as Promise<AnswersResult> & {
      ui: PromptUI
    }
  }
  const appConfig = getAppConfig()
  const searchList = getPagesWithoutTabBarPages(appConfig)
  return inquirer.prompt<AnswersResult>(
    [
      {
        type: "checkbox-plus",
        name: "pages",
        message: "选择要编译的页面(可输入过滤):",
        pageSize: 10,
        highlight: true,
        searchable: true,
        prefix: "",
        default: answer?.reuseCache ? readAnswerPages(extra?.pad) : [],
        source: getPagesSource(searchList),
        validate: validatePages(appConfig),
      },
    ],
    answer
  )
}
