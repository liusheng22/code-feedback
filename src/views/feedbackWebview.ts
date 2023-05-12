import { WebviewView, WebviewViewProvider } from 'vscode'
import * as vscode from 'vscode'
import { WebviewHtml } from '../webview/feedback-html'
import { post } from '../request/index'

export class FeedbackWebView implements WebviewViewProvider {
  constructor(
    private readonly context: vscode.ExtensionContext
  ) {
  }

  public static viewId: string = 'code-snippet'
  public static webviewView: any
  public static feedbackApi: string = 'http://localhost:2000/feedback/add'

  resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
    // 开启js
    webviewView.webview.options = {
      enableScripts: true
    }

    let webview = webviewView.webview
    FeedbackWebView.webviewView = webviewView

    new WebviewHtml(webviewView)

    // 暴露出来webview
    this.context.globalState.update('feedbackWebview', webview)

    webviewView.webview.html = WebviewHtml.html

    // 收到webview的消息
    webview.onDidReceiveMessage((data) => {
      let { command, message } = data

      switch (command) {
        case 'submitFeedback':
          this.submitFeedback(message)
          vscode.window.showInformationMessage('提交成功，感谢您的反馈！')
          break
        default:
          break
      }
    })
  }

  submitFeedback(data: any) {
    post(FeedbackWebView.feedbackApi, JSON.stringify(data))
  }

  postMessage(webviewView: WebviewView, command: any, message: any, reply?: any) {
    webviewView.webview.postMessage({
      command, message 
    })
  }
}
