export const enum LocalStorageKeys {
  token = 'INSUITE_TOKEN', // 用户登录令牌token
  wxOpenId = 'WX_OPEN_ID' // 微信用户的openid
}

export const enum sessionStorageKeys {
  loadParams = 'APP_LODA_PARAMS', // 应用加载的参数
  flowParams = 'FLOW_PARAMS', // 工作流加载的参数
  x2manyCommand = 'X2MANY_COMMAND', // 记录表体操作的命令
  loginAccount = 'LOGIN_ACCOUNT', // 登录的账号
  reportData = 'REPORT_DATA', // 报表点击数据
  buttonFunc = 'BUTTON_FUNC' // 点击的按钮函数
}

export const DEFAULT_DIGIT = 2

export const getCommandCache = () => {
  const cache = sessionStorage.getItem(sessionStorageKeys.x2manyCommand)
  return JSON.parse(cache || '{}')
}
