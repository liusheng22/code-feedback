import * as vscode from 'vscode';
import * as child_process from 'child_process';

// 获取git用户名
const getGitUserName = async () => {
  const gitUserName = child_process.execSync('git config user.name').toString().trim();
  return gitUserName;
};

// 获取文件的每行代码git修改信息
const getFileGitBlame = async () => {
  const editor = vscode.window.activeTextEditor;
  const document = editor?.document;
  const uri = document?.uri;
  const fileName = uri?.fsPath;

  // 获取光标所选的行数
  const selection = editor?.selection;
  const startLine: any = selection?.start.line;
  const endLine: any = selection?.end.line;

  // 获取光标所在行
  const activeLine: any = editor?.selection.active.line;

  let isSelect: Boolean = startLine !== endLine;

  // let repoPath = vscode.workspace.rootPath;
  let path: any = vscode.window.activeTextEditor?.document.uri.path;
  let repoPath = vscode.Uri.file(path);
  const extension = vscode.extensions.getExtension('vscode.git');
  const gitExtension = extension?.isActive ? extension?.exports : await extension?.activate();
  let gitApi = gitExtension?.getAPI(1);
  let repository = gitApi?.getRepository(uri);
  
  // 获取文件的记录
  const blame = await repository.blame(fileName, { startLine, endLine });
  let blameArrTemp = blame.split('\n');
  let gitBlameArr:any = [];
  blameArrTemp.forEach((str: any) => {
    let strArr = str.split(' ');
    let commitId = strArr[0];
    // 正则匹配author
    let authorSnippet = str.match(/\((.*?)\)/)[1];
    let author = authorSnippet.match(/(Not Committed Yet)|(\S{2,})/)[0];

    // 正则匹配日期
    let date = str.match(/\d{4}-\d{2}-\d{2}/)[0];
    // 取出author后面的str
    let strSuffix = str.split(author)[1];
    // 正则匹配行数
    let lineNum = strSuffix.match(/\d{1,3}\)/)[0].split(')')[0];
    // 取出行数后面的代码
    let code = strSuffix.split(`${lineNum}) `)[1];
      
    gitBlameArr.push({
      commitId,
      author,
      date,
      lineNum,
      code
    });
  });


  let selectedCodeArr = filterGitBlame({ gitBlameArr, startLine, endLine });

  return selectedCodeArr;
};

/**
 * 对 gitBlameArr 进行处理
 * - 仅取出选中的代码行 (startLine + 1) - (endLine + 1)
 * - 去掉名称 item.author 为"Not Committed Yet"的
 * - 对 item.author 去重
 * - 返回选中的代码行
 */
const filterGitBlame = ({gitBlameArr, startLine, endLine} : any) => {
  let selectedCodeArr = gitBlameArr.filter((item: any) => {
    return item.lineNum >= (startLine + 1) && item.lineNum <= (endLine + 1);
  }).filter((item: any) => {
    return item.author !== 'Not Committed Yet';
  }).reduce((acc: any, cur: any) => {
    const hasAuthor = acc.some((item: any) => {
      return item.author === cur.author;
    });
    if (!hasAuthor) {
      acc.push(cur);
    }
    return acc;
  }, []);
  return selectedCodeArr;
};

export {
  getGitUserName,
  getFileGitBlame
};