import * as vscode from 'vscode';
import * as path from 'path';
import { FeedbackWebView } from './views/feedbackWebview';
import { DemoWebview } from './views/demoWebview';
import { getGitUserName, getFileGitBlame } from './git/info';

export function activate(context: vscode.ExtensionContext) {

  // 通过 ctrl+shift+p - openCodeSnippetFeedbackPanel 指令 打开反馈面板
  let openPanel = vscode.commands.registerCommand('code-feedback.openCodeSnippetFeedbackPanel', () => {
    // 打开 viewsContainers 下的 code-feedback
    vscode.commands.executeCommand('workbench.view.extension.code-feedback');
  });

  context.subscriptions.push(openPanel);

  // 注册代码片段展示/反馈面板
  const feedbackWebview = new FeedbackWebView(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(FeedbackWebView.viewId, feedbackWebview)
  );


  // 注册demo演示面板
  const demoWebview = new DemoWebview(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(DemoWebview.viewId, demoWebview)
  );
  

  // 监听vscode选中文本事件
  vscode.window.onDidChangeTextEditorSelection(async (event) => {
    const postMessage = (command: String, data?: any) => {
      feedbackWebview.postMessage(FeedbackWebView.webviewView, command, data);
    };

    // 每次生成一个唯一的id
    let selectId = Math.random().toString(36).substr(2);
    postMessage('beginSelected', selectId);

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      // 一段默认的注释文本
      let defaultText = `// 通过选择代码片段，来进行反馈`;
      postMessage('codeSnippet', defaultText);
      return '';
    }

    // 更新选择的代码片段
    const selection = editor.selection;
    const text = editor.document.getText(selection);
    text && postMessage('codeSnippet', text);
    
    // vscode插件启动后，延迟调用，以下是代码
    setTimeout(async () => {
      let name = await getGitUserName();
      postMessage('gitUserName', name);
    }, 1000);


    // 更新代码片段的作者
    let updateCodeAuthor = (data: any) => {
      let codeAuthor = data.map((item: any) => {
        return item.author;
      });
      postMessage('codeAuthor', codeAuthor);
    };

    // 获取代码片段的git blame信息
    let codeAuthorArr = await getFileGitBlame();
    updateCodeAuthor(codeAuthorArr);
    // 冗余 - 再调用一次，避免首次调用时git初始化未成功
    setTimeout(async () => {
      codeAuthorArr = await getFileGitBlame();
      updateCodeAuthor(codeAuthorArr);
    }, 1000);
        
    // 获取当前文件的类型
    // const fileType = path.extname(editor.document.fileName);
  });
}

export function deactivate() {}
