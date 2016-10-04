var fs = require('fs'),
    _ = require('underscore'),
    path = require('path');

function getRandomUrls(inputFile, noOfUrls){
console.log("Generating random urls...")
  var fileName = path.basename(inputFile),
      inputFileContent = fs.readFileSync(inputFile), // || fs.readFileSync("/home/indix/ind9/cannonball/test"),
      allUrls = inputFileContent.toString().split("\n").map(a=> a.trim()),
      //noOfUrls = noOfUrls < allUrls ? noOfUrls : Math.round(allUrls/2),
      randomUrls = [];
  do{
    var randomNum = Math.random(),
        randomUrl = getRandomUrl(allUrls, randomNum);
        randomUrls.push(randomUrl);
    randomUrls = _.uniq(randomUrls);
  }while(randomUrls.length < noOfUrls)
  fs.writeFileSync(fileName.split('.')[0]+"_randomUrls.txt", randomUrls.join("\n"));
  console.log("Random Urls are written to - " + fileName.split('.')[0]+"_randomUrls.txt");
}

function getRandomUrl(allUrls, randomNum){
  return allUrls[Math.round(randomNum * (allUrls.length-1))]
}

module.exports =  getRandomUrls