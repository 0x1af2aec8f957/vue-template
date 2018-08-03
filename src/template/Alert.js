/*
* <div class="alert-box">
      <div>
        <h5 class="alert-title">登录失败，请重新登录</h5>
        <p class="alert-info">你需要重新登录才能继续浏览。</p>
        <div class="alert-btn"><span class="btn-yes">确定</span></div>
      </div>
    </div>
* */

let time, // 消失的时间
  timer // 计时器

const id = `Alert-${new Date().getTime()}`

const [alertEl, alertTitle, alertInfo, alertBtn, div, element] = [
  document.createElement('div'),
  document.createElement('h5'),
  document.createElement('p'),
  [
    document.createElement('span'),
    document.createElement('span'),
  ],
  document.createElement('div'), document.createElement('div'),
]

alertEl.id = id
alertEl.className = 'alert-box'
alertTitle.className = 'alert-title'
alertInfo.className = 'alert-info'
div.className = 'alert-btn'

alertBtn[0].className = 'btn-yes'
alertBtn[1].className = 'btn-no'
alertBtn[0].innerText = '确定'
alertBtn[1].innerText = '取消'

element.appendChild(alertTitle)
element.appendChild(alertInfo)
alertEl.appendChild(element)
element.appendChild(div)

function alert ({title = `${location.origin}：`, content = '', confirm, cancel}) { // this isInstanceof vue.constractor
  alertTitle.innerHTML = title
  alertInfo.innerHTML = content

// 移除 or 清空
  alertBtn[0].parentElement === div && div.removeChild(alertBtn[0])
  alertBtn[1].parentElement === div && div.removeChild(alertBtn[1])
//  So do ...
  const el = document.getElementById(id)
  el && alertEl.parentElement.removeChild(alertEl) // 先移除已有DOM
  if (confirm) alertBtn[0].onclick = function ($event) {
    $event.stopPropagation()
    confirm.call(this)
    return alertEl.parentElement.removeChild(alertEl)
  }.bind(this)
  div.appendChild(alertBtn[0])
  if (cancel) {
    alertBtn[1].onclick = function ($event) {// this isInstanceof vue.constractor
      $event.stopPropagation()
      cancel.call(this)
      return alertEl.parentElement.removeChild(alertEl)
    }.bind(this)
    div.appendChild(alertBtn[1])
  }
  return document.body.appendChild(alertEl)
}

export { alert }
