'use strict';

class WindowManager {
  constructor(settings) {
    this.windows = [];
    this.app = settings.app;

    this.app.on('window-all-closed', this.windowsAllClosed);
  }

  windowsAllClosed() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
      app.quit();
    }
  }

  addWindow(window) {
    this.windows.push(window);

    window.on('closed', this.removeWindow.bind(this, window));

    console.log('Window added. Open windows:', this.windows.length);
  };

  removeWindow(window) {
    this.windows = this.windows.filter(function(x) {
      return x !== window;
    });

    console.info('Window removed. Open windows:', this.windows.length);
  }
}

module.exports = WindowManager;
