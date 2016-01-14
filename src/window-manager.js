'use strict';

const BrowserWindow = require('browser-window');


class WindowManager {
  constructor(config) {
    this.windows = [];
  }

  addWindow(window) {
    this.windows.push(window);

    window.on('closed', this.removeWindow.bind(this, window));

    console.log('Window opened. Open windows:', this.windows.length);
  }

  removeWindow(window) {
    this.windows = this.windows.filter(function(x) {
      return x !== window;
    });

    console.info('Window closed. Open windows:', this.windows.length);
  }

  activeWindow() {
    return BrowserWindow.getFocusedWindow();
  }

  visibleWindows() {
    return this.windows.filter(function(window) {
      return !window.isMinimized();
    });
  }

  activateNextWindow() {
    var windows = this.visibleWindows();
    var idx = windows.indexOf(this.activeWindow());
    var nextWindow = windows[++idx] || windows[0];

    if (!nextWindow) {
      return;
    }

    nextWindow.focus();
  }
}

module.exports = WindowManager;
