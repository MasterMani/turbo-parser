var program = require('commander'),
    fetcher = require('./run'),
    randomUrlsGen = require('./randomUrls.js'),
    path = require('path'),
    fs = require('fs');

var getFileName = function(filePath){
  var fileName = path.basename(filePath);
  return fileName.split('.')[0]
}
//randomUrlsGen("./randomUrls.txt", 10)
//fetcher(urlsArr, resultFileName)

program
    .version('1.0.0')
    .option('-a, --allUrlsFilePath <value>', "Enter all urls file path")
    .option('-r, --randomUrlsFilePath <value>', "Enter random urls file path")
    .option('-n, --noOfUrls <value>', "Enter number of urls")
    .parse(process.argv);

var allUrlsFileName = program.allUrlsFilePath,
    randomUrlsFileName = program.randomUrlsFilePath,
    noOfUrls = program.noOfUrls;
if(allUrlsFileName && noOfUrls){
  randomUrlsGen(allUrlsFileName, parseInt(noOfUrls))
  var correctFileName = getFileName(allUrlsFileName),
      inputUrls = fs.readFileSync(correctFileName+"_randomUrls.txt").toString().split("\n").map(a=>a.trim())
  fetcher(inputUrls, correctFileName+"_result.tsv")
}else if(randomUrlsFileName){
  var inputUrls = fs.readFileSync(randomUrlsFileName).toString().split("\n").map(a=>a.trim()),
      correctFileName = getFileName(randomUrlsFileName);
  fetcher(inputUrls, correctFileName+"_result.tsv")
}else{
  console.log(program.help())
}
