let element, // 通知元素嵌套的ID
  time, // 消失的时间
  timer // 计时器

const id = `Notify-${new Date().getTime()}`
const [parentEl, messageEl, messageBtn] = [
  document.createElement('div'),
  document.createElement('em'),
  document.createElement('i')]

parentEl.id = id
parentEl.className = 'message-box'
messageEl.className = 'message-body'
messageBtn.className = 'message-close'
messageBtn.onclick = function ($event) {
  clearTimeout(timer)
  this.parentElement.parentElement.removeChild(parentEl)
  return $event.stopPropagation()
}
parentEl.appendChild(messageEl)
parentEl.appendChild(messageBtn)

function config (el, line = 1500) {
  return element = el, time = line
}

function notify (message) {
  if (message) {
    const el = document.getElementById(element)
    if (el) {
      if (!el.querySelector(`#${id}`)) el.appendChild(parentEl)
      clearTimeout(timer)
      timer = setTimeout(() => {
        el.removeChild(parentEl)
        clearTimeout(timer)
      }, time + 1000)
      return messageEl.innerHTML = message
    }
  }
  return null
}

export default {
  config,
  notify,
}
