import fs from 'fs'
import path from 'path'
import {promisify} from 'util'
import mkdirp from 'mkdirp'
export interface Config {
    access_token: string
    AK: string
    SK: string
    user_name: string
    password: string
}
export const configPath = path.resolve(__dirname,"../config.json")
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

export const rootDir = "./files"

export const mkdirpp: (dirPath:string)=>void = promisify(mkdirp)