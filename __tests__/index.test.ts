import itaro from "../src"
import { ITARO_ENV } from "../src/constants"

const appConfig = { pages: ["pages/index/index", "pages/demo/index"] }

describe("itaro", () => {
  afterEach(() => {
    delete process.env[ITARO_ENV]
  })

  test("不存在环境变量", () => {
    expect(itaro(appConfig)).toEqual(appConfig)
  })

  test("不存在环境变量，额外自定义", () => {
    expect(
      itaro(appConfig, (c) => {
        c.debug = false
        return c
      })
    ).toEqual(appConfig)
  })

  test("存在环境变量", () => {
    process.env[ITARO_ENV] = JSON.stringify({ pages: ["pages/index/index"] })
    expect(itaro(appConfig)).toEqual({ pages: ["pages/index/index"] })
  })

  test("存在环境变量，额外自定义", () => {
    process.env[ITARO_ENV] = JSON.stringify({ pages: ["pages/index/index"] })
    expect(
      itaro(appConfig, (c) => {
        c.debug = false
        return c
      })
    ).toEqual({ pages: ["pages/index/index"], debug: true })
  })
})
