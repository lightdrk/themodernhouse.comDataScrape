const axios = require('axios');
const { JSDOM } = require('jsdom');

const uniqureUrl = {};

const webUrl = 'https://www.themodernhouse.com';
async function req(url){
  return axios.get(url);
}

function linkList(data){
  const hrefRegex = /href="\/[a-zA-Z0-9]+(\/[a-zA-Z0-9-]+)*\/"/g;
  let matchs = [...new Set(data.match(hrefRegex))];
  let UrlData = [];
  for (let n of matchs){
    n = n.split('href=');
    UrlData.push(n[1]);
  }

  return UrlData ;
   
}

async function details(link){
  if(uniqureUrl[link]){
    return;
  }
  uniqureUrl[link] = 1;
  link = link.replace(/"/g,'');
  link = webUrl.concat(link);

  console.log(link);
  let response = await req(link);
  const html = new JSDOM(response.data);
  const document = html.window.document;
  const data = document.getElementsByClassName('property__top');
  if (data.length > 0){
    console.log(data);
    return;
  }
  let reqData = await req(link);
  let listUrl = linkList(reqData.data);
  console.log(link);
  for (let n of listUrl){
    details(n);
  }
}

async function main(){
  let response  = await req(webUrl);
  let data = response.data;
  let link_save =  linkList(data);
  for (let n of link_save){
    details(n);
  }
}

main();
