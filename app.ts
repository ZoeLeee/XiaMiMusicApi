import Axios from 'axios';
import * as Koa from 'koa';
import { Get } from './src/utils/myRequest';
import * as cheerio from 'cheerio';
import { arrayLast } from './src/utils/utils';

const app = new Koa();

interface AnyObject{
  [key:string]:string|number;
}

app.use(async ctx => {
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
  else if(ctx.path === "/dailySongs"){
    let url="recommend/getDailySongs";
    let data = await Get(url);
    ctx.body = data;
  }
  else if(ctx.path === "/collectDetail"){
    let url="collect/initialize"
    let data = await Get(url, {
      params: {
        _q:{"listId":"955851266"},
      }
    });
    ctx.body = data;
  }
  else if(ctx.path === "/search"){
    let keyword=ctx.query.key;
    let url="search/searchSongs";
    let data = await Get(url, {
      params: {
        _q: {"key":keyword,"pagingVO":{"page":1,"pageSize":30}},
      }
    });
    ctx.body = data;
  }
  else if(ctx.path === "/getPlayInfo"){
    let songIds=JSON.parse(ctx.query.songIds);
    let url="song/getPlayInfo";
    let data = await Get(url, {
      params: {
        _q: {"songIds":songIds},
      }
    });
    ctx.body = data;
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