import { WebviewView } from "vscode";
import * as vscode from 'vscode';
import preCodeSnippet from "./pre-code";
import { WebviewUtils } from "../utils/uri";

export class WebviewHtml {

  constructor(
    private readonly webviewView: WebviewView
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
    
    // 引用webview.js
    const webviewJsUri = path2Uri('feedback/webview.js');
    // 引用webview.css
    const webviewCssUri = path2Uri('feedback/webview.css');

    // 引用highlight.js
    const highlightJsUri = path2Uri('highlight/index.js');
    // 引用highlight.css
    const highlightCssUri = path2Uri('highlight/index.css');

    WebviewHtml.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>
        <link rel="stylesheet" href="${webviewCssUri}">
        <link rel="stylesheet" href="${highlightCssUri}">
        <script src="${highlightJsUri}"></script>
      </head>
      <body>

        <!-- 代码展示 -->
        ${preCodeSnippet}

        <!-- select选择器 -->
        <div class="feedback-type-title">反馈类型：</div>
        <div class="feedback-type">
          <select name="feedback-type" id="feedback-type">
            <option value="1">最佳实现，学习一下</option>
            <option value="2">有点东西，但是不多</option>
            <option value="3">有点不妙，有待优化</option>
            <option value="4">很有问题，需要重构</option>
          </select>
        </div>

        <!-- 作者列表 -->
        <div class="code-author-list">代码片段参与人：<span class="name"></span></div>

        <!-- 反馈人 - 可匿名 -->
        <div class="feedback-submitter">
          <div class="feedback-submitter__anonymous">
            <input type="checkbox" name="anonymous" id="anonymous" value="anonymous" checked>
            <label for="anonymous">匿名提交</label>
          </div>
          <div class="feedback-submitter__name" style="display:none;">反馈人：<span class="name"></span></div>
        </div>

        <button class="btn" style="display: none">提交</button>

        <!-- 存放唯一ID - 隐藏DOM -->
        <div class="code-id" style="display: none"></div>

        <script src="${webviewJsUri}"></script>
        <script>hljs.highlightAll();</script>
      </body>
      </html>
    `;
  }
}