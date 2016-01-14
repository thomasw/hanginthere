'use strict';

const remote = require('electron').remote;
const _ = require('lodash');

console.log('Preload script injected');

var curWindow = remote.getCurrentWindow();

function getAccountData() {
  var accountList = [];
  var accountSelector = '#account-list li[id^="account"]';

  _.each(document.querySelectorAll(accountSelector), function(data) {
    var nameEl = data.querySelector('.account-name') || {};
    var emailEl = data.querySelector('.account-email') || {};
    var iconURL;
    var accountID;

    try {
      iconURL = data.querySelector('img').getAttribute('src');
    } catch(e) {
      console.error('Couldn\'t retrieve icon URL', e);
    }

    try {
      accountID = data.querySelector('button').getAttribute('id');
      accountID = accountID.split('choose-account-').join('');
    } catch(e) {
      console.error('Couldn\'t retrieve account ID, skipping.', e);
      return;
     }

    accountList.push({
      name: nameEl.innerText,
      email: emailEl.innerText,
      id: accountID,
      icon: iconURL
    });
  });

  curWindow.emit('account-data-loaded', accountList);

  console.log('Account data', accountList);
}

document.addEventListener('DOMContentLoaded', getAccountData);
