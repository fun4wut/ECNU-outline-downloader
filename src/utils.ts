import readline from 'readline'


// 简易封装的Promise版本 readLine
export async function readLine(){
    return new Promise<string>((resolve,reject)=>{
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        rl.on('line', (line: string) => {
            if (line === "" || line.length != 4){
                console.log("格式错误，请重新输入!")
            }
            else {
                rl.close()
                resolve(line)
            }
        })
    })
}

// 通过二进制的头8位来判断是否是doc
export function doc(buff: Buffer): string {
    if (buff.slice(0,8).toString() 
    == Buffer.from([0xd0,0xcf,0x11,0xe0,0xa1,0xb1,0x1a,0xe1]).toString()) 
        return ".doc"
    else 
        return ".docx"
}

