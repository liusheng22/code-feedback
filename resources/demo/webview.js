const vscode = acquireVsCodeApi()

// 监听图片点击事件
let imgEl = document.querySelector('.demo-image img')
imgEl.addEventListener('click', function (e) {
  // 获取图片的 src
  let src = imgEl.getAttribute('src')
  // 图片的filename
  let filename = src.split('/').pop()
  vscode.postMessage({
    command: 'openImage',
    message: filename
  })
})
