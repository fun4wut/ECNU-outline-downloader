import fs, { mkdirSync } from 'fs'
import {agent,login,refreshToken} from './login'
import cheerio from 'cheerio'
import path from 'path'  
import _ from 'lodash'
import {mkdirpp,rootDir} from './other'
const SEARCH_URL = "http://applicationnewjw.ecnu.edu.cn/eams/publicSearch!search.action"
const BASE_URL = "http://applicationnewjw.ecnu.edu.cn"
const HOME_URL = "http://applicationnewjw.ecnu.edu.cn/eams/home.action"

//标准的请求数据
const standardFormData = {
    "lesson.project.id": 2,
    "semester.id": "",
    "lesson.no": "COMS",
    "lesson.course.name": "", 
    "lesson.courseType.id": "",
    "lesson.teachDepart.id": "",
    "teacher.name": "",
    "fake.teacher.null": "...",
    "lesson.teachClass.grade": "",
    "fake.weeks": "",
    "startWeekSchedule": "",
    "endWeekSchedule": "",
    "fake.time.weekday": "...",
    "fake.time.unit": "",
    "lesson.campus.id": "...",
    "lesson.course.education.id": "",
    "lesson.semester.id": 705
}
interface DownloadTask {
    subject: string
    grade: number
    semester: number
    name: string
    type: string
    link: string
}
async function serachBySubject(subject: string, grade: number, semester: number) {
    try{
        const res = await agent.post(SEARCH_URL)
            .type("application/x-www-form-urlencoded")
            .set("Referer","http://applicationnewjw.ecnu.edu.cn/eams/publicSearch.action")
            .send({
                ...standardFormData,
                "lesson.no": subject,
                //705是第一学期，737为第二学期
                "lesson.semester.id": semester==1?705:737,
                "lesson.teachClass.grade": 19-grade,
                pageSize: 1000
            })
        //console.log(res.text)
        const $ = cheerio.load(res.text)
        const tr = $(".gridtable > tbody tr").toArray()
        // 按名称去重
        return _.uniqBy(tr.map( e=>(
            {
                subject,
                grade,
                semester,
                name: $(e).children().eq(2).text(),
                type: $(e).children().eq(3).text(),
                link: $(e).children().eq(11).children().attr("href")
            } as DownloadTask
        )),'name')
    } catch{
        console.log("地址获取失败")
        return Promise.reject("地址获取失败")
    }
}
async function downloadSingle(e: DownloadTask,root: string = rootDir) {
    let res = await agent.get(BASE_URL + e.link)
    const $ = cheerio.load(res.text)
    const uri = $(".gridtable > tbody tr a").attr("href")
    if (!uri) {
        console.log("该课程无大纲："+e.name)
        Promise.reject("存在错误的uri")
    }
    else {
        res = await agent.get(BASE_URL+uri).responseType("blob")
        const dirPath = path.resolve(root,`${e.subject}/大${e.grade}${e.semester==1?'上':'下'}/${e.type}`)
        await mkdirpp(dirPath)
        fs.writeFile(path.resolve(dirPath,`${e.name}${doc(res.body)}`), res.body,(err)=>{
            if (err){
                console.log("下载失败，文件名："+e.name)
                Promise.reject()
            }
            else Promise.resolve()
        })
    }
    
}

async function downloadBatch(subject: string, grade: number, semester: number,root:string = rootDir) {
    try {
        await login()
        //获取sessionID
        await agent.get(HOME_URL)
        const tasks = await serachBySubject(subject,grade,semester)
        
        // TODO:并发的粒度可以再细一点
        Promise.all(tasks.map(e=>downloadSingle(e,root)))
    } catch  {
        Promise.reject()
    }
    console.log(`已保存至${root}`)
}

//downloadBatch("COMC",1,2,path.resolve(__dirname,"../files"))



function doc(buff: Buffer): string {
    if (buff.slice(0,8).toString() 
    == Buffer.from([0xd0,0xcf,0x11,0xe0,0xa1,0xb1,0x1a,0xe1]).toString()) 
        return ".doc"
    else 
        return ".docx"
}

export default downloadBatch;