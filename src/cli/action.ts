import { OptionValues } from "commander"
import { AnswersResult, processAnswers } from "./answer"
import { getAppConfig } from "./appConfig"
import {
  Question,
  useCacheQuestion,
  selectQuestion,
  reuseCacheQuestion,
} from "./questions"
import { checkSetting } from "./util"

/* eslint-disable */
const shelljs = require("shelljs")
interface ActionArgs {
  answer?: AnswersResult
  questions?: Question[]
}

// 检查命令
checkSetting()

const initActionArgs = (options: OptionValues): ActionArgs => {
  if (options.ignore) {
    // 不进行询问进行选择操作
    return {
      questions: [selectQuestion],
    }
  }

  if (options.reuse) {
    // 直接从上次缓存继续
    return {
      answer: {
        reuseCache: true,
      },
      questions: [selectQuestion],
    }
  }

  if (options.cache) {
    return {
      answer: { cache: true },
    }
  }
  return { questions: [useCacheQuestion, reuseCacheQuestion, selectQuestion] }
}

const process = (options: OptionValues) => {
  const script = options.script.join(" ")
  const actionArgs = initActionArgs(options)
  let promise = Promise.resolve(actionArgs.answer)
  if ((actionArgs.questions?.length ?? 0) > 0) {
    actionArgs.questions?.forEach(
      (question) => (promise = promise.then(question))
    )
  }
  promise.then((answer) => {
    console.log(answer)
    const appConfig = getAppConfig()
    processAnswers(appConfig, answer ?? {})
    shelljs.exec(script)
  })
}

module.exports = { process }
