import fs from 'fs'
import path from 'path'
import {promisify} from 'util'
import mkdirp from 'mkdirp'
import os from 'os'
export interface Config {
    access_token: string
    AK: string
    SK: string
    user_name: string
    password: string
}

if (!fs.existsSync(path.resolve(os.homedir(),"./eod"))){
    fs.mkdirSync(path.resolve(os.homedir(),"./eod"))
}

export const configPath = path.resolve(os.homedir(),"./eod/config.json")

export function emptyConfig() {
    if (!fs.existsSync(configPath)){
        fs.writeFileSync(configPath,JSON.stringify({
            access_token: "",
            AK: "",
            SK: "",
            user_name: "",
            password: "",
        }))
    }
}

export const rootDir = path.join(process.cwd(),"/files")

export const mkdirpp: (dirPath:string)=>void = promisify(mkdirp)