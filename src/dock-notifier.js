'use strict';

class DockNotifier {
  constructor(config) {
    this.dock = config.dock;

    this.unreadCount = 0;
    this.lastDockAction = null;
  }

  cancelDockAlert() {
    this.unreadCount = 0;
    this.dock.cancelBounce(this.lastDockAction);
    this.dock.setBadge('');
  }

  dockAlert() {
    ++this.unreadCount;
    this.lastDockAction = this.dock.bounce();
    this.dock.setBadge(this.unreadCount.toString());
  }

  messageReceived() {
    this.dockAlert();
  }

  resetDock() {
    if(this.lastDockAction === null) { return; }

    this.cancelDockAlert();
  }
}

module.exports = DockNotifier;
