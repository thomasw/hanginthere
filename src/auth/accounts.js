'use strict';

const BrowserWindow = require('browser-window');
const path = require('path');


class AccountManager {
  constructor(config) {
    this._url = 'https://accounts.google.com/SignOutOptions';
    this._invisible = true;
  }

  _getBrowser() {
    return new BrowserWindow({
      show: !this._invisible,
      webPreferences: {
        preload: path.join(__dirname, 'window-js/account-getter.js')
      }
    });
  }

  _getAccounts(resolve, reject) {
    var browser = this._getBrowser();

    var resolveAndCleanup = (value) => {
      resolve(value);
      browser.destroy();
    };

    var rejectAndCleanup = (reason) => {
      reject(reason);
      browser.destroy();
    };

    browser.loadURL(this._url);

    browser.once('account-data-loaded', (data, error) => {
      if (error) {
        rejectAndCleanup(error);
      }

      resolveAndCleanup(data);
    });

    setTimeout(() => {
      rejectAndCleanup(new Error('Timeout after 10000 ms'));
    }, 10000);

    browser.webContents.once('did-fail-load', () => {
      rejectAndCleanup(new Error('Failed to load account data.'));
    });

    browser.webContents.once('crashed', () => {
      rejectAndCleanup(new Error('Failed to load account data.'));
    });
  }

  getAccounts() {
    return new Promise(this._getAccounts.bind(this));
  }
}

module.exports = AccountManager;
