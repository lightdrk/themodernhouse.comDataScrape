const cheerio = require('cheerio');
const axios = require('axios');
async function x(){

const l =  await axios.get('https://www.themodernhouse.com/sales-list');   
let links=[];
let un=[]
const $ = cheerio.load(l.data);
$('a').each((index,element)=>{
  const href = $(element).attr('href');
  un.push(href);
  if (href[0]=='/'){
    links.push(href);
  }
});
console.log(links);
  console.log(un);
}
x();
