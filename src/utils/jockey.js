//
//  JockeyJS
//
//  Copyright (c) 2013, Tim Coulter
//
//  Permission is hereby granted, free of charge, to any person obtaining
//  a copy of this software and associated documentation files (the
//  "Software"), to deal in the Software without restriction, including
//  without limitation the rights to use, copy, modify, merge, publish,
//  distribute, sublicense, and/or sell copies of the Software, and to
//  permit persons to whom the Software is furnished to do so, subject to
//  the following conditions:
//
//  The above copyright notice and this permission notice shall be
//  included in all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
//  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
//  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
//  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Non-accessible variable to send to the app, to ensure events only
// come from the desired host.

window.Jockey = { listeners: {} };

const { host } = window.location;
let messageCount = 0;

// i.e., on a Desktop browser.
const nullDispatcher = {
  send(envelope, complete) { complete(); },
  triggerCallback() {},
  sendCallback() {},
};

// Dispatcher detection. Currently only supports iOS.
// Looking for equivalent Android implementation.
const iDevices = ['iPad', 'iPhone', 'iPod'];
const iOS = iDevices.some(iDevice => navigator.platform.indexOf(iDevice) >= 0);

// Detect UIWebview. In Mobile Safari proper, jockey urls cause a popup to
// be shown that says "Safari cannot open page because the URL is invalid."
// From here: http://stackoverflow.com/questions/4460205/detect-ipad-iphone-webview-via-javascript

const [UIWebView, isAndroid] = [/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent), navigator.userAgent.toLowerCase().indexOf('android') > -1];

const createEnvelope = (id, type, payload) => ({
  id, type, host, payload,
});

function jockeyOn(type, fn) {
  const { listeners } = window.Jockey;
  if (!listeners[type]) listeners[type] = [];
  listeners[type].push(fn);
}

function jockeyOff(type) {
  const { listeners } = window.Jockey;
  if (!listeners[type]) listeners[type] = [];
  listeners[type] = [];
}

const Dispatcher = {
  callbacks: {},
  send(envelope, complete, callback) {
    Dispatcher.dispatchMessage('event', envelope, complete, callback);
  },
  sendCallback(messageId) {
    const envelope = createEnvelope(messageId);

    Dispatcher.dispatchMessage('callback', envelope, () => {});
  },
  triggerCallback(id) {
    // Alerts within JS callbacks will sometimes freeze the iOS app.
    // Let's wrap the callback in a timeout to prevent this.
    const callback = Dispatcher.callbacks[id];
    return typeof callback === 'function' && process.nextTick(callback); // 执行完毕回调APP
  },
  // `type` can either be "event" or "callback"
  dispatchMessage(type, envelope, complete, callback) {
    // We send the message by navigating the browser to a special URL.
    // The iOS library will catch the navigation, prevent the UIWebView
    // from continuing, and use the data in the URL to execute code
    // within the iOS app.
    Dispatcher.callbacks[envelope.id] = () => {
      complete();
      delete Dispatcher.callbacks[envelope.id];
    };

    if (type === 'event' && typeof callback === 'function') {
      jockeyOn(envelope.type, (...rest) => {
        jockeyOff(envelope.type);
        callback(...rest);
      });
    }

    const src = `jockey://${type}/${envelope.id}?${encodeURIComponent(JSON.stringify(envelope))}`;
    let iframe = window.document.createElement('iframe');
    iframe.setAttribute('src', src);
    window.document.documentElement.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
    iframe = null;
  },
};

const dispatcher = (iOS && UIWebView) || isAndroid ? Dispatcher : nullDispatcher;

Object.assign(window.Jockey, {

  // Called by the native application when events are sent to JS from the app.
  // Will execute every function, FIFO order, that was attached to this event type.
  trigger(type, messageId, json) {
    const { listeners } = window.Jockey;
    const listenerList = listeners[type] || [];
    let executedCount = 0;
    const complete = () => {
      executedCount += 1;
      return executedCount >= listenerList.length && dispatcher.sendCallback(messageId);
    };

    // If it's a "sync" listener, we'll call the complete() function
    // after it has finished. If it's async, we expect it to call complete().

    listenerList.forEach((listener) => {
      if (listener.length <= 1) {
        listener(json);
        return complete();
      }
      return listener(json, complete);
    });
  },

  // Called by the native application in response to an event sent to it.
  // This will trigger the callback passed to the send() function for
  // a given message.
  triggerCallback: dispatcher.triggerCallback, // params:{id}
});

export default {
  on: jockeyOn,
  off: jockeyOff,
  send(type, payload = {}, complete = Function, callback) {
    const sendParams = payload instanceof Function ? {
      complete: payload,
      payload: null,
    } : { complete, payload };
    const envelope = createEnvelope(messageCount, type, sendParams.payload);
    messageCount += 1;
    dispatcher.send(envelope, sendParams.complete, callback);
  },
};
