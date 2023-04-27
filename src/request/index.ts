import * as http from 'http';
import * as https from 'https';

// http 发送 post请求
export function post(url: string, data: any, callback?: any) {
  let req = http.request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  }, (res) => {
    let result = '';
    res.on('data', (chunk) => {
      result += chunk;
    });
    res.on('end', () => {
      callback(result);
    });
  });
  req.on('error', (err) => {
    console.log('请求失败 =>', err);
  });
  req.write(data);
  req.end();
}

// https 发送 post请求
export function postHttps(url: string, data: any, callback: any) {
  let req = https.request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  }, (res) => {
    let result = '';
    res.on('data', (chunk) => {
      result += chunk;
    });
    res.on('end', () => {
      callback(result);
    });
  });
  req.on('error', (err) => {
    console.log('请求失败 =>', err);
  });
  req.write(data);
  req.end();
}