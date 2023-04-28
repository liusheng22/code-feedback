import { WebviewView, WebviewViewProvider } from 'vscode';
import * as vscode from 'vscode';
import { WebviewHtml } from '../webview/demonstration-html';
import { WebviewUtils } from '../utils/uri';

export class DemoWebview implements WebviewViewProvider {
  constructor(
    private readonly context: vscode.ExtensionContext
  ) {
  }

  public static viewId: string = 'demo-use';
  public static webviewView: any;

  resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
    // 开启js
    webviewView.webview.options = {
      enableScripts: true,
    };
    
    let webview = webviewView.webview;
    DemoWebview.webviewView = webviewView;

    new WebviewHtml(webviewView, this.context);

    // 暴露出来webview
    this.context.globalState.update('demoWebview', webview);

    webviewView.webview.html = WebviewHtml.html;

    // 收到webview的消息
    webview.onDidReceiveMessage((data) => {
      let { command, message } = data;

      switch (command) {
      case 'openImage':
        this.previewImage(webview);
        break;
      default:
        break;
      }
    });
  }

  previewImage(webview: any) {
    let webviewUtils = new WebviewUtils(DemoWebview.webviewView);
    let { path2Uri } = webviewUtils;
    let imageUri = path2Uri('image/demonstration.gif');

    // 打开预览面板
    const panel = vscode.window.createWebviewPanel(
      'imagePreview', // 面板 ID
      '代码片段反馈 - 操作演示', // 面板标题
      vscode.ViewColumn.One, // 显示位置
      {}
    );
      
    // 通过 webview 显示图片
    panel.webview.html = `
      <html>
        <body>
          <img src="${imageUri}" />
        </body>
      </html>
    `;
  }

  postMessage(webviewView: WebviewView, command: any, message: any, reply?: any) {
    webviewView.webview.postMessage({ command, message });
  }
}
