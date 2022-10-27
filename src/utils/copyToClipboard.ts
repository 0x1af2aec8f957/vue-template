export default function copyToClipboard(text:string) {
    const input = document.createElement('input');
    const commandName = 'copy'; // https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand#%E5%91%BD%E4%BB%A4
    input.value = text;
    Object.entries({
        opacity: 0,
        position: 'fixed',
        zIndex: -1
    }).forEach(([key, value]:[string, string|number]) => {
    // @ts-ignore
        input.style[key] = value;
    });
    input.setAttribute('readonly', 'readonly');
    document.body.appendChild(input);
    input.focus();
    input.setSelectionRange(0, input.value.length);
    // @ts-ignore
    if (!document.execCommand(commandName, false, null)) throw new Error('在调用`document.execCommand`复制时发生错误');
    input.blur();
    document.body.removeChild(input);
}
