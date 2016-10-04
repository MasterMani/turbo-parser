var request = require('request'),
    fs = require('fs');

var turboUrl = "http://turbo01.production.indix.tv:9000/ondemand/parse?app_id=c98a317a&app_key=6a0732d5402f4d98debc99b8917dbb0e&hacks=false&url=";

var urlsArr = ["http://www.homedepot.com/p/Samsung-Laundry-Pedestal-with-Storage-Drawer-in-Azure-WE357A0Z/206987325",
"http://www.homedepot.com/p/Laundry-123-15-in-Laundry-Pedestal-with-Storage-Drawer-in-White-XHPC155XW/202563165",
"http://www.homedepot.com/p/LG-Electronics-Laundry-Pedestal-with-Storage-Drawer-in-Graphite-WDP4V/202192417",
"http://www.homedepot.com/p/Samsung-Laundry-Pedestal-with-Storage-Drawer-in-Platinum-WE357A0P/203690451",
"http://www.homedepot.com/p/RIDGID-1-Layer-Everyday-Dirt-Pleated-Paper-Filter-for-5-0-gal-RIDGID-Wet-Dry-Vacs-VF4000/100021159",
"http://www.homedepot.com/p/GE-Refrigerator-Water-Filter-MWF/204635201",
"http://www.homedepot.com/p/RIDGID-Filter-for-5-0-gal-RIDGID-Wet-Dry-Vacs-2-Pack-VF4200/202650894",
"http://www.homedepot.com/p/Samsung-Refrigerator-Water-Filter-HAF-CINS/205972946",
"http://www.homedepot.com/p/HDX-Water-Filter-for-GE-Refrigerators-Dual-Pack-HDX2PKDS0/206621305",
"http://www.homedepot.com/p/HDX-FMS-2-Refrigerator-Replacement-Filter-Fits-Samsung-HAF-CINS-2-Pack-107019/204049391"];

var productUrls = fs.readFileSync("randomUrls.txt").toString().split("\n").map(a=>a.trim()),
    headers = "parsedUrl\ttitle\tsku\tupc\tmpn\tbrand\timageUrl\tminSalePrice\tminListPrice\tavailability\tcategoryTexts\tadditionalAttributes\tsmallDescription\tlongDescription\tspecificationText\texternalProductUrl\tcanonicalUrl\turlsToSeeder\tstatusCode\n";


// getResults(urlsArr, "test.tsv")
//getResults(productUrls, "result.tsv")

function getResults(urlsArr, file){
  if(file) fs.writeFileSync(file, headers)
  urlsArr.forEach(function(el, i){
    setTimeout(function(){
      getParseResult(turboUrl, el).then(function(data){
        var parsingUrl = data.split("|||")[1];
        parsingUrl = decodeURIComponent(parsingUrl.replace(turboUrl, ""))
        if(file){
          var op = JSON.parse(data.split("|||")[0]);
          var result = parsingUrl + "\t" + getFields(op)
          console.log(result)
          fs.appendFileSync(file, result)
        }
        if(!file) console.log(data)
      }).catch(function(err){
        // var parsedUrl = err.split("|||")[0],
        //     result = parsedUrl+"\t\t\t\t\t\t\t\t\t\t\t\t\t\t"+"000"+"\n";
        console.log(err)
        //fs.appendFileSync(file, result)
      })
    }, 3000*i)
  });
}

function getFields(jsonData){

  var prod = jsonData.products[0],
      price = jsonData.prices[0],
      title = prod.title,
      sku = prod.sku || "",
      upc = prod.upc || "",
      mpn = prod.manufacturerPartNumber || "",
      brand = prod.brand || "",
      imageUrl = prod.imageUrl || "",
      catText = prod.categoryTexts.join().toString(),
      addAttrs = JSON.stringify(prod.additionalAttributes),
      exProdUrl = prod.externalProductUrl,
      canUrl = prod.canonicalUrl,
      urlsToSeed = jsonData.urlsToSeeder || "",
      statusCode = jsonData.statusCode,
      sPrice = price.minSalePrice,
      lPrice = price.minListPrice,
      avail = price.availabilityText || "",
      shipText = price.shippingText || "",
      sDesc = prod.smallDescription || "",
      lDesc = prod.longDescription || "",
      spec = prod.specificationText || "";
  return `${title}\t${sku}\t${upc}\t${mpn}\t${brand}\t${imageUrl}\t${sPrice}\t${lPrice}\t${avail}\t${catText}\t${addAttrs}\t${sDesc}\t${lDesc}\t${spec}\t${exProdUrl}\t${canUrl}\t${urlsToSeed}\t${statusCode}\n`
}

function getParseResult(turboUrl, prodUrl){
  return new Promise(function(resolve, reject){
    var fetchUrl = turboUrl + encodeURIComponent(prodUrl);
    request(fetchUrl, function(err, res, body){
      if(err) reject(err)
      resolve(body + "|||" + res.request.href)
    });
  });
}

module.exports = getResults;
