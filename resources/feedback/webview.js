const vscode = acquireVsCodeApi();

let useCodeId = "";

// 按钮 - 提交反馈
document.querySelector(".btn").addEventListener("click", () => {
  let anonymous = document.querySelector("#anonymous").checked;
  let feedbackEl = document.querySelector(".code-snippet");
  let feedback = feedbackEl.innerText;
  let authorEl = document.querySelector(".code-author-list .name");
  let authorText = authorEl.innerText;
  let author = authorText.split("、");
  let submitterEl = document.querySelector(".feedback-submitter__name .name");
  let submitter = submitterEl.innerText;
  let codeIdEl = document.querySelector(".code-id");
  let codeId = codeIdEl.innerText;
  let type = document.querySelector("#feedback-type").value;
  let btnEl = document.querySelector(".btn");
  submitter = anonymous ? "" : submitter;

  let data = {
    anonymous,
    feedback,
    author,
    submitter,
    type,
    codeId,
  };
  console.log("数据提交 =>", data);

  if (!feedback.trim()) {
    return;
  }

  if (useCodeId && useCodeId === codeId) {
    feedbackEl.innerHTML = "// 已经提交过了，重写选择一段代码再提交吧！";
    hljs.highlightAll();
    return;
  }

  vscode.postMessage({
    command: "submitFeedback",
    message: data,
  });

  // 提交成功后，清空数据
  useCodeId = codeId;
  feedbackEl.innerHTML = "// 提交成功，感谢您的反馈！";
  authorEl.innerText = "";
  submitterEl.innerText = "";
  btnEl.style.display = "none";
  hljs.highlightAll();
});

// 更新用户选择的代码片段到视图上
function updateCodeSnippet(message) {
  // message 为html片段，将message进行转义
  message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // 为保证代码格式，使用innerHTML而不是innerText
  document.querySelector(".code-snippet").innerHTML = message;

  // 高亮代码片段
  setTimeout(() => {
    hljs.highlightAll();
  }, 10);
}

// 更新代码片段的作者
function updateCodeAuthor(message) {
  let el = document.querySelector(".code-author-list .name");
  el.innerText = message.join("、");
}

// 更新git用户名 - 提交者
function updateGitUserName(message) {
  let el = document.querySelector(".feedback-submitter__name .name");
  el.innerText = message;
}

// 更新按钮的状态
function updateViewBtn(message) {
  document.querySelector(".btn").style.display = "block";
  document.querySelector(".code-id").innerText = message;
}

// 监听postMessage事件
window.addEventListener("message", (event) => {
  let { command, message } = event.data;

  switch (command) {
    case "beginSelected":
      updateViewBtn(message);
      break;
    case "codeSnippet":
      updateCodeSnippet(message);
      break;
    case "codeAuthor":
      updateCodeAuthor(message);
      break;
    case "gitUserName":
      updateGitUserName(message);
      break;
    default:
      break;
  }
});

// 监听input checkbox的点击事件id=anonymous的点击事件
document.querySelector("#anonymous").addEventListener("click", () => {
  let anonymous = document.querySelector("#anonymous").checked;

  if (anonymous) {
    document.querySelector(".feedback-submitter__name").style.display = "none";
  } else {
    document.querySelector(".feedback-submitter__name").style.display = "block";
  }
});
