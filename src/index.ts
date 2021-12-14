import { ITARO_ENV } from "./constants"

const itaro = (appConfig: any, cb?: (config) => any) => {
  if (process.env[ITARO_ENV]) {
    const config = JSON.parse(process.env[ITARO_ENV] || "")
    return cb?.(config) ?? config
  } else {
    return appConfig
  }
}

export default itaro
