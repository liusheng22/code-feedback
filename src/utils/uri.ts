import * as vscode from 'vscode';

export class WebviewUtils {
  constructor(
    private readonly webviewView: any,
    private readonly context?: any
  ) {}

  path2Uri = (path: string) => {
    let webview = this.webviewView.webview;
    return webview.asWebviewUri(vscode.Uri.joinPath(vscode.Uri.file(__dirname),'../..','resources', path));
  };

  img2Uri = (path: string) => {
    let webview = this.webviewView.webview;
    webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'src', 'assets', path));
  };
}