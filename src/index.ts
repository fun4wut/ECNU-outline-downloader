import program from 'commander'
// 避免导入错误，先创建config.json
import {emptyConfig, configPath, Config} from './other'
emptyConfig()
import download from './download'
import {refreshToken, saveConfig} from './login'

program.option("-g, --grade <grade>","specify the grade",)
    .option("-s, --semester <semester>","specify the semester")
    .option("-u, --username <username>","specify the username")
    .option("-p, --password <password>","specify the password")
    .option("-A, --AK <AK>","specify the client_id")
    .option("-S, --SK <SK>","specify the client_secret" )
    .option("-o, --output <output>","specify the output dir")
    .option("-H, --hand-mode","use the handMode to input code instead of AI")

program.command("go <subject>")
    .description("下载指定学科的大纲")
    .action((subject) => download(subject,program.grade,program.semester,program.output,program.handMode))

program.command("show")
    .description("检查配置")
    .action( ()=>console.log(require(configPath)) )

program.command("refresh")
    .description("刷新TOKEN")
    .action(refreshToken)

program.command("init")
    .description("初始化")
    .action(()=>{
        let token = ""
        // 没有获取到token也能正确保存
        refreshToken(program.AK,program.SK,false)
            .then(tmpToken => {
                token = tmpToken
            }).catch(()=>console.log("信息不足！"))
            .then( () => saveConfig({
                password: program.password,
                user_name: program.username,
                AK: program.AK,
                SK: program.SK,
                access_token: token
            }))
    })

program.parse(process.argv)

export default program