import Axios from 'axios';
import * as Koa from 'koa';
import { Get } from './myRequest';
import * as cheerio from 'cheerio';

const app = new Koa();



app.use(async ctx => {
  console.log(ctx.path);
  if (ctx.path === "/getCollects") {
    let q = { "limit": 9, "order": "recommend", "page": 1 };
    let url = "collect/getCollects";

    let data = await Get(url, {
      params: {
        _q: q,
      }
    });
    ctx.body = data;
  }
  else if (ctx.path === "/banner") {
    let res = await Axios.get("https://www.xiami.com/");
    const $ = cheerio.load(res.data);
    let hrefList = $(".show3>a");
    let banners = [];
    for (let a of Array.from(hrefList)) {
      let href = a.attribs.href;
      let songIndex = href.indexOf("/song/");
      let albumIndex = href.indexOf("/album/");
      let collectIndex = href.indexOf("/collect/");
      let endIndex = href.indexOf("?");
      let id: string;
      let banner: any = {
        picUrl: "https:" + a.firstChild.attribs.src
      };
      if (songIndex !== -1) {
        id = href.slice("/song/".length, endIndex);
        banner.songId = id;
      }
      else if (albumIndex !== -1) {
        id = href.slice("/album/".length, endIndex);
        banner.albumId = id;
      }
      else if (collectIndex !== -1) {
        id = href.slice("/collect/".length, endIndex);
        banner.collectId = id;
      }
      banners.push(banner);
     
    }
    ctx.body={
      code:200,
      banners
    }
  }
  else
    ctx.body = {
      code:-1,
      msg:"请求不存在"
    };
});


app.listen(3100, () => {
  console.log(`正在监听${3100}端口`);
});