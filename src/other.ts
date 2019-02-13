import fs from 'fs'
import path from 'path'
export interface Config {
    access_token: string
    AK: string
    SK: string
    user_name: string
    password: string
}

export function emptyConfig() {
    if (!fs.existsSync(path.resolve(__dirname,"../config.json"))){
        fs.writeFileSync(path.resolve(__dirname,"../config.json"),JSON.stringify({
            access_token: "",
            AK: "",
            SK: "",
            user_name: "",
            password: "",
        }))
    }
}