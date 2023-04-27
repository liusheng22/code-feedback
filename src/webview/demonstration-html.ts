import { WebviewView } from "vscode";
import * as vscode from 'vscode';
import { WebviewUtils } from '../utils/uri';

export class WebviewHtml {

  constructor(
    private readonly webviewView: WebviewView,
    private readonly context: vscode.ExtensionContext
  ) {
    this.initHtml();
  }

  public static html: string = '';

  initHtml() {
    const webviewView = this.webviewView;
    const webview = webviewView.webview;

    // 开启js
    webview.options = {
      enableScripts: true,
    };

    let webviewUtils = new WebviewUtils(webviewView);
    let { path2Uri } = webviewUtils;
    
    // 引用js
    const webviewJsUri = path2Uri('demo/webview.js');

    // demo gif
    const demoImageUri = path2Uri('image/demonstration.gif');

    WebviewHtml.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>
      </head>
      <body>
        <!-- show demo gif -->
        <div class="demo-image">
          <img class="demo-image-img" src="${demoImageUri}" alt="">

          <div class="demo-image-title">点击图片，大屏预览</div>
        </div>
      </body>

      <script src="${webviewJsUri}"></script>

      <style>
        .demo-image {
          width: 100%;
          height: auto;
        }
        .demo-image img {
          width: 100%;
          height: auto;
          cursor: pointer;
        }
        .demo-image .demo-image-title {
          width: 100%;
          margin-top: 10px;
          text-align: center;
        }
      </style>
      </html>
    `;
  }
}