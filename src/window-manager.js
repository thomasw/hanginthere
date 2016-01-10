'use strict';

class WindowManager {
  constructor(config) {
    this.BrowserWindow = config.BrowserWindow;
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
    return this.BrowserWindow.getFocusedWindow();
  }
}

module.exports = WindowManager;
