# ECNU-outline-downloader 
[![Build Status](https://travis-ci.org/fun4wut/ECNU-outline-downloader.svg?branch=master)](https://travis-ci.org/fun4wut/ECNU-outline-downloader)
[![npm version](https://badge.fury.io/js/ecnu-outliner.svg)](https://badge.fury.io/js/ecnu-outliner)

## Intro
本工具致力于解决下载ECNU的教学大纲繁琐的问题，仅需输入账户名，密码，百度API的密钥【用于图像识别】，和要下载的课程序号即可下载所有的课程大纲与本地，**现已发布至NPM** 🎉

## Preparation
### 获取百度云API的密钥
1.  浏览器进入 [百度云控制台](https://console.bce.baidu.com)，完成注册/登陆操作
2.  右侧边栏找到`人工智能-文字识别`选项，点击进入
3.  点击创建应用，填写完简易的表格，拿到AK【client_id】和SK【client_secret】

### 安装node环境
* windows下直接进入[官网](https://nodejs.org/zh-cn/)下载LTS版本

* *nix系推荐使用[nvm](https://github.com/creationix/nvm)

### ***可选项 -- 安装yarn***
yarn作为包管理工具，无缝衔接npm，而且更快
```bash
npm i -g yarn
```

### 从npm下载本工具
```bash
npm i -g ecnu-outliner
# or yarn global add ecnu-outliner
```

## Configuration
配置文件路径在 ~/eod/config.json
### 使用命令行进行配置
```bash
eod -u <username> -p <password> -A <AK> -S <SK> # 输入关键信息，获取token
```
### 使用配置文件进行配置
```bash
eod # 创建配置文件
vim ~/eod/config.json # 输入配置，token项可留空
eod refresh # 获取token
```
## Usage
```
Options:
  -V, --version              output the version number
  -g, --grade <grade>        specify the grade
  -s, --semester <semester>  specify the semester
  -u, --username <username>  specify the username
  -p, --password <password>  specify the password
  -A, --AK <AK>              specify the client_id
  -S, --SK <SK>              specify the client_secret
  -o, --output <output>      specify the output dir
  -h, --help                 output usage information

Commands:
  go <subject>               下载指定学科的大纲
  show <param>               检查参数
  refresh                    刷新TOKEN
  init                       初始化
```
## Example
下载 大一上学期的计算机系的的所有大纲到当前目录的files文件夹下
 ```bash
eod go COMS -g 1 -s 1
 ```

下载 大二下学期的数学系的所有大纲到指定目录【绝对路径】下
```bash
eod go MATH -g 2 -s 2 -o <abspath>
```

修改用户名
```bash
eod init -u <username>
```
## TODO
- [ ] 细化并发的粒度
- [ ] 支持更复杂检索条件
- [ ] 加入手打验证码的选项，避免了申请百度云密钥的繁琐
- [x] 做成二进制包，发布至NPM

## Contribution
* 求STAR
* 欢迎向本项目提PR
* 发现BUG请及时提出Issue