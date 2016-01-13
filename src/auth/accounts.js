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

    browser.loadURL(this._url);

    browser.once('account-data-loaded', (data, error) => {
      if (error) {
        reject();
      }

      resolve(data);

      if (this._invisible) {
        browser.destroy();
      }
    });

    browser.webContents.once('did-fail-load', reject);
    browser.webContents.once('crashed', reject);
  }

  getAccounts() {
    return new Promise(this._getAccounts.bind(this));
  }
}

module.exports = AccountManager;
