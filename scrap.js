const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const uniqureUrl = {'/':1};
const skip = ['/sell','/journal','/guide','/about','/contact','/careers','/terms','/privacy-policy','/newsletter']
const webUrl = 'https://www.themodernhouse.com';
async function req(url,retry=0){
  retry++;
  if(retry > 3){
    return {'data': false}; 
  }
  try{
    let request = await axios.get(url);
    return request;
  }catch(error){
      await new Promise((resolve)=> setTimeout(resolve,3000*retry));
      return req(url,retry);
  }
 
}


function linkList(data){
  let hrefList=[];
  const $ = cheerio.load(data);
  $('a').each((index,element)=>{
    let href = $(element).attr('href');
    if(href[0]=='/'){
      let skipIt =false ;
      for (let nx of skip){
        if (href.includes(nx)){
          skipIt = true;
          break;
        }
      }
      if (!skipIt){
        hrefList.push(href);
      }
    }
  });
  console.log(hrefList);
  return [...new Set(hrefList)];
}

async function details(link){
  console.log('unqi',link);
  if(uniqureUrl[link]){
    return;
  }
  uniqureUrl[link] = 1;
  link = link.replace(/"/g,'');
  link = webUrl.concat(link);
  console.log(link);
  let response = await req(link);
  if (response){
    if (response.data){
      const $ = cheerio.load(response.data);
      const releventData= $('.property__top').html();
      const dataTelephone = $('.property__top__call').text();
      if (dataTelephone){
        console.log('telephone ',dataTelephone);
        fs.appendFileSync('scrapped.txt',`${dataTelephone} \n`,'utf-8');
        return;
      }
    }
  
    try{
      if (response.data){

        let listUrl = linkList(response.data);
        for (let n of listUrl){
          await new Promise((resolve)=> setTimeout(resolve,5000));
          details(n);
        }
      }
    }catch(error){
      console.log(error);
    }
  }
}

async function main(){
  let response  = await req(webUrl);
  let data = response.data;
  let link_save =  linkList(data);
  console.log(link_save);
  for (let n of link_save){
    await details(n);
  }
}

main();


//TODO: error breaks the loop, retry .
