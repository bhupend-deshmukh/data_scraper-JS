const cheerio = require("cheerio");

const request = require("request");

const fs = require("fs");

const URL = "https://www.quill.com/hanging-file-folders/cbk/122567.html";

const writeStream = fs.createWriteStream("data.csv");

writeStream.write(
  `Product-Price,Product-Model,Product-Number,Product-Category,Product-Name`
);

request(URL, async (err, res, html) => {
  if (err && res.statusCode != 200) return "Request failed";

  const $ = cheerio.load(html);

  $(".SearchResultsNew").each((ind, ele) => {

	if (ind > 9) return;

	const product_name = $(ele).find("#skuName").text().replace(/,|"|;|\s\s+/g, "");
    
	const product_price = $(ele).find(".pricePh").children("strong").text().replace(/\s\s+/g, "");
    
	const product_number = $(ele).find(".iNumber").text().replace("Item # ", "");
    
	const product_model = $(ele).find(".model-number").text().replace("Model # ", "");
    
	const product_category = $(html).find(".ML_s").text().replace(/>/g, " > ");
    
	writeStream.write(
      `${product_price},${product_model},${product_number},${product_category},${product_name} \n`
    );
	
  });

  console.log("Done!");
});
