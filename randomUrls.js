var fs = require('fs'),
    _ = require('underscore');

var inputUrls = fs.readFileSync("/home/indix/ind9/cannonball/test"),
    allUrls = inputUrls.toString().split("\n").map(a=> a.trim()),
    randomUrls = [];

do{
  var randomNum = Math.random(),
      randomUrl = getRandomUrl(allUrls, randomNum);
      randomUrls.push(randomUrl);
  randomUrls = _.uniq(randomUrls);
}while(randomUrls.length < 500)


fs.writeFileSync("randomUrls.txt", randomUrls.join("\n"));

function getRandomUrl(allUrls, randomNum){
  return allUrls[Math.round(randomNum * (allUrls.length-1))]
}