
const isProd = process.env.NODE_ENV === 'production'

const wxEnv = process.env.WX_ENV || 'dev'     // dev 测试公众号  uat 灰度公众号  prod  生产公众号

export default {

  IS_PROD: isProd, 

  BASE_URL: wxEnv === 'dev' ? 'http://182.92.100.160:18080' : 
    (wxEnv === 'uat' ? 'http://odoo.studio.insuite.net' : 'http://odoo.studio.insuite.cn'),

  WX_APP_ID: wxEnv === 'dev' ? 'wxef1dd7f831c0b5f6' :
    (wxEnv === 'uat' ? 'wx33e995dcf375d68a' : 'wx33e995dcf375d68a'),
    
  WX_OPEN_ID: 'oWkYa5j_tQDiPWuWvdcbimgI40Tk'
}