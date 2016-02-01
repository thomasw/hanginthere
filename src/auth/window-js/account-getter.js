'use strict';

const remote = require('electron').remote;
const _ = require('lodash');

console.log('Preload script injected');

var curWindow = remote.getCurrentWindow();

function getAccountData() {
  var accountList = [];
  var accountSelector = '#account-list li[id^="account"]';

  _.each(document.querySelectorAll(accountSelector), function(data) {
    let nameEl = data.querySelector('.account-name') || {};
    let emailEl = data.querySelector('.account-email') || {};
    let humanizedAccelerator = '';
    let iconURL;
    let accountId;
    let accelerator;
    let selectorId;

    try {
      iconURL = data.querySelector('img').getAttribute('src');
    } catch(e) {
      console.error('Couldn\'t retrieve icon URL', e);
    }

    try {
      accountId = data.querySelector('button').getAttribute('id');
      accountId = accountId.split('choose-account-').join('');
      accountId = parseInt(accountId);
    } catch(e) {
      console.error('Couldn\'t retrieve account ID, skipping.', e);
      return;
    }

    selectorId = (accountId + 1) % 10;

    if (accountId < 10) {
      accelerator = `CmdOrCtrl+${selectorId}`;
      humanizedAccelerator = humanizeAccelrator(accelerator, remote.process.platform);
    }

    accountList.push({
      name: nameEl.innerText,
      email: emailEl.innerText,
      id: accountId,
      icon: 'https:' + iconURL,
      selectorId: selectorId,
      accelerator: accelerator,
      humanizedAccelerator: humanizedAccelerator
    });
  });

  curWindow.emit('account-data-loaded', accountList);

  console.log('Account data', accountList);
}

function humanizeAccelrator(accelerator, platform) {
  let humanizedAccelerator = accelerator.replace('CmdOrCtrl+', 'Ctrl')

  if(platform === 'darwin') {
    humanizedAccelerator = accelerator.replace('CmdOrCtrl+', '⌘');
  }

  return humanizedAccelerator;
}

document.addEventListener('DOMContentLoaded', getAccountData);
