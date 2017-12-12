require('shelljs/global')//地址 https://github.com/shelljs/shelljs
env.NODE_ENV = 'production'
var path = require('path')
var config = require('../config')
var ora = require('ora')
var fs = require('fs')
var cmd = require('node-cmd')
var childProcess = require('child_process')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.test.conf')

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)

var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.test.assetsRoot, config.test.assetsSubDirectory)
var modulePath = path.join(config.test.assetsRoot, config.test.assetsModuleDirectory)
rm('-rf', assetsPath)
rm('-rf', modulePath)
// cmd.run('rm -rf '+modulePath+'/*')
mkdir('-p', assetsPath)
mkdir('-p', modulePath)
cp('-R', 'static/*', assetsPath)

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
  var fileLength = fs.readdirSync(modulePath)
  for(i=0;i<fileLength.length;i++){
    var fileName = fileLength[i].split('.').shift();
    var rs = fs.createReadStream(modulePath+'/'+fileName+'.html')
    var ws = fs.createWriteStream(modulePath+'/'+fileName+'.ftl')
    rs.pipe(ws);
    console.log(fileName)
  }
  setTimeout(()=>{
    for(i=0;i<fileLength.length;i++){
      var fileName = fileLength[i].split('.').pop();
      if(fileName=='html'){
        fs.unlinkSync(modulePath+'/'+fileLength[i])
      }
    }
    console.log("html文件删除完成")
  },1000)
  // cp('-R', modulePath+'/*.ftl', config.build.htmlRoot)//这方法有问题，有待研究
  // cmd.run('cp -r ./dist/module/* '+config.build.htmlRoot)
  setTimeout(()=>{
    cmd.get('cp -r '+modulePath+'/*.ftl '+config.build.htmlRoot,function(err, data, stderr){
      if(err){
        console.log(err)
        return;
      }
      console.log('文件本地部署完成')
      childProcess.execFile(path.resolve(__dirname, '../config/deploy.bat'),{cwd:config.build.javaRoot},function(e, stdout, stderr) {
          if(e){
            console.log(e);
            return;
          }
    　　　console.log(stdout);
          console.log('git远程仓库push完成')
      });
    })
  },2000)
})
