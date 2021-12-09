import * as inquirer from "inquirer"
import {
  getAppConfig,
  hasAppConfigCache,
  getPagesWithoutTabBarPages,
} from "./appConfig"
import {
  AnswersResult,
  validatePages,
  processAnswers,
  getPagesSource,
  readAnswerPages,
} from "./answer"
import {
  checkArgs,
  checkSetting,
  getCommandArgs,
} from "./util"
const shelljs = require("shelljs")

// 检查命令
checkArgs()
checkSetting()

// 注册插件
inquirer.registerPrompt(
  "checkbox-plus",
  require("inquirer-checkbox-plus-prompt")
)
inquirer.registerPrompt("autocomplete", require("inquirer-autocomplete-prompt"))

const appConfig = getAppConfig()
const searchList = getPagesWithoutTabBarPages(appConfig)

const process = (answers) => {
  processAnswers(appConfig, answers)
  const args = getCommandArgs()
  shelljs.exec(args.join(" "))
}

inquirer
  .prompt<AnswersResult>([
    {
      type: "confirm",
      message: "是否沿用上次配置？",
      name: "cache",
      when: hasAppConfigCache,
    },
    {
      type: "confirm",
      message: "是否基于上次配置进行修改？",
      name: "useCache",
      when: (answers) => answers.cache !== true,
    },
  ])
  .then(async (answers) => {
    if (answers.cache) {
      process(answers)
      return
    }
    inquirer
      .prompt([
        {
          type: "checkbox-plus",
          name: "pages",
          message: "选择要编译的页面(可输入过滤):",
          pageSize: 10,
          highlight: true,
          searchable: true,
          prefix: "",
          default: answers.useCache ? readAnswerPages() : [],
          source: getPagesSource(searchList),
          validate: validatePages(appConfig),
        },
      ])
      .then((a) => {
        process({ ...answers, ...a })
      })
  })
