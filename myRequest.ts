import Axios, { AxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';


const UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36";

const headers = {
  'user-agent': UserAgent,
  "cookie": " xm_sg_tk=ce1573ccfada2c4d438b29a3d7499655_1604209347226; xm_sg_tk.sig=vdhhrB8euKwEc9FXSx7_0VEhzY8DuyAknOn1NBkrIto;"
};

function getMD5(tk: string, api: string, query: string) {
  const hash = crypto.createHash('md5');
  return hash.update(`${tk}_xmMain_/api/${api}_${query}`).digest("hex");
}

const instance = Axios.create({
  baseURL: 'https://www.xiami.com/api/',
  timeout: 1000,
  headers
});

async function GetCurrentCookie() {
  let data = await Axios.get("https://www.xiami.com/");
  let cookies: string[] = data.headers["set-cookie"];

  let xm_sg_tk2: string;
  let xm_sg_tk: string;
  let xm_sg_tk_sig: string;
  for (let cookie of cookies) {
    cookie=cookie.trim();
    if (xm_sg_tk && xm_sg_tk && xm_sg_tk_sig) break;
    if (cookie.includes("xm_sg_tk")) {
      console.log('cookie: ', cookie);
      if (cookie.includes("xm_sg_tk.sig")) {
        xm_sg_tk_sig = cookie.split("; ")[0];
      }
      else {
        xm_sg_tk = cookie.split("; ")[0];
        xm_sg_tk2 = cookie.slice(9).split("; ")[0].split("_")[0];
      }
    }
  }
  
  instance.defaults.headers.cookie = `${xm_sg_tk}; ${xm_sg_tk_sig};`;

  return xm_sg_tk2;
}

export async function Get(url: string, config: AxiosRequestConfig) {
  let xm = await GetCurrentCookie();
  if (config.params?._q) {
    config.params._s = getMD5(xm, url, JSON.stringify(config.params?._q));
  }
  let data = await instance.get(url, config);
  return data.data;
}
