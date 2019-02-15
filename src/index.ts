import program from 'commander'
// 避免导入错误，先创建config.json
import {emptyConfig} from './other'
emptyConfig()
import download from './download'
import {refreshToken, saveConfig} from './login'
import process from 'process'


program.version("0.1.1")
    .option("-g, --grade <grade>","specify the grade",)
    .option("-s, --semester <semester>","specify the semester")
    .option("-u, --username <username>","specify the username")
    .option("-p, --password <password>","specify the password")
    .option("-A, --AK <AK>","specify the client_id")
    .option("-S, --SK <SK>","specify the client_secret" )
    .option("-o, --output <output>","specify the output dir")
    

program.command("go <subject>")
    .description("下载指定学科的大纲")
    .action((subject) => download(subject,program.grade,program.semester,program.output))

program.command("show <param>")
    .description("检查参数")
    .action((param)=>console.log(program[param]))

program.command("refresh")
    .description("刷新TOKEN")
    .action(refreshToken)

program.command("init")
    .description("初始化")
    .action(()=>{
        refreshToken(program.AK,program.SK,false)
            .then(token => {
                saveConfig({
                    password: program.password,
                    user_name: program.username,
                    AK: program.AK,
                    SK: program.SK,
                    access_token: token
                })
            }).catch(()=>console.log("信息不足！"))
    })

program.parse(process.argv)

export default program