import { AppConfig } from "@tarojs/taro"
import { ITARO_ENV } from "./constants"

const itaro = <T extends AppConfig>(
  appConfig: T,
  cb?: (config: AppConfig & T) => AppConfig & T
) => {
  if (process.env[ITARO_ENV]) {
    const config = JSON.parse(process.env[ITARO_ENV] || "")
    return cb?.(config) ?? config
  } else {
    return appConfig
  }
}

export default itaro
