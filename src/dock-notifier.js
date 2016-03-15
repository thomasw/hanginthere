'use strict';

class DockNotifier {
  constructor(config) {
    this.dock = config.dock;
    this._windowManager = config.windowManager;
  }

  dockAlert(event, unreadCount) {
    this.dock.setBadge(unreadCount ? unreadCount.toString() : '');
  }
}

module.exports = DockNotifier;
