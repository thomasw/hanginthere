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
    var window_manager = this;

    this.windows.push(window);

    console.info('Window list after addition:', this.windows);

    window.on('closed', function() {
      window_manager.removeWindow(this);
    });
  };

  removeWindow(window) {
    this.windows = this.windows.filter(function(x) { x !== this;});
    console.info('Window list after removal:', this.windows);
  }
}

module.exports = WindowManager;
