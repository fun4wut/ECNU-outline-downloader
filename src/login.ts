import superagent from 'superagent'
import encode from './des'
import cheerio from 'cheerio'
import {Config} from './other'
const config: Config = require("../config.json")
import {CookieAccessInfo} from 'cookiejar'
import images from 'images'
import fs from 'fs'
import path from 'path'
const LOGIN_URL = "https://portal1.ecnu.edu.cn/cas/login?service=http%3A%2F%2Fportal.ecnu.edu.cn%2Fneusoftcas.jsp"
const PIC_URL = "https://portal1.ecnu.edu.cn/cas/code"
const OCR_URL = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic"
const TOKEN_URL = "https://aip.baidubce.com/oauth/2.0/token"
const agent = superagent.agent().timeout(5000)

async function login(userName:string = config.user_name, pwd:string = config.password) {
    const res = await agent.get(LOGIN_URL)
    let ltReg = /id="lt" name="lt" value="(.*?)" \/>/
    let executionReg = /name="execution" value="(.*?)" \/>/
    const lt = ltReg.exec(res.text)![1]
    const execution = executionReg.exec(res.text)![1]
    const rsa = encode(userName+pwd+lt,"1","2","3")
    let b64 = await downloadPic()
    const code = await getCode(config.access_token,b64)
    const res2 = await agent.post(LOGIN_URL).type("application/x-www-form-urlencoded").send({
        code,
        loginFace: "",
        rsa,
        ul: 11,
        pl: 8,
        lt,
        execution,
        _eventId: "submit"
    })
    return agent.jar.getCookies(new CookieAccessInfo("portal.ecnu.edu.cn")).toValueString()
}

async function downloadPic() {
    const codePath = path.resolve(__dirname,"../code.jpg")
    //解析图片
    const res = await agent.get(PIC_URL).buffer(true).parse(superagent.parse.image)
    //必须要对图片瞎jb处理下才能识别
    images(res.body).resize(80).save(codePath)
    return fs.readFileSync(codePath).toString("base64")
}

async function getCode(token: string, pic:string): Promise<String> {
    try {
        const res = await agent.post(OCR_URL)
            .query({"access_token":token})
            .type("application/x-www-form-urlencoded")
            .send({"image": pic})    
        //console.log(JSON.parse(res.text))
        return JSON.parse(res.text).words_result[0].words
    } catch (error) {
        console.log("请更换ACCESS_TOKEN！")
        return Promise.reject()
    } 
}

// AK ,SK 默认套用config.json
async function refreshToken(AK = config.AK,SK = config.SK,save:boolean = true) {
    try {
        const res = await agent.get(TOKEN_URL)
        .query({
            grant_type: "client_credentials",
            client_id: AK,
            client_secret: SK
        })
        
        config.access_token = JSON.parse(res.text).access_token
        if (save)
            fs.writeFileSync(path.resolve(__dirname,"../config.json"), JSON.stringify(config))
        return config.access_token
    } catch (error) {
        console.log("刷新token失败")
        return Promise.reject()
    } 
}

function saveConfig(newConfig: Config){
    fs.writeFileSync(path.resolve(__dirname,"../config.json"), 
    // 增量式对config进行修改 ，先stringify再parse是为了删除undefined的字段
    JSON.stringify({...config, ...JSON.parse(JSON.stringify(newConfig))}))
}


export {refreshToken, login, agent, saveConfig}