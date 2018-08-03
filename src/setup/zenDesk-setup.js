
export async function setZendeskLanguage(
  lang,
  {
    greetings, title, avatar, name, subTitle,
  },
) {
  window.zE('webWidget', 'setLocale', lang === 'zh-TW' ? 'zh_TW' : lang.substr(0, 2));

  /* eslint-disable no-unused-expressions */
  window.$zopim?.livechat.prechatForm.setGreetings(greetings);
  window.$zopim?.livechat.window.setTitle(title);
  window.$zopim?.livechat.concierge.setAvatar(avatar);
  window.$zopim?.livechat.concierge.setName(name);
  window.$zopim?.livechat.concierge.setTitle(subTitle);
}

export function setZenDeskStatus(status) {
  if (status) return window.$zopim?.livechat.button.show();
  return window.$zopim?.livechat.button.hide();
}
