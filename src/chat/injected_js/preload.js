'use strict';

console.info('Preload script injected.');

const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
const webFrame = require('web-frame');
const SpellCheckProvider = require('electron-spell-check-provider');
const ContactListMonitor = require('./contact-list-monitor');

const locale = remote.app.getLocale();

const clIframeSel = '#gtn-roster-iframe-id-b';
const clDataContainerSel = '.c-m.c-m-Ed.al.Mz.Ln';
const logoSel= '#gbq1 a';

var contactListMonitor = new ContactListMonitor({Observer: MutationObserver});

function monitorContactList() {
  var contactList = document.querySelector(clIframeSel);
  contactList = contactList && contactList.contentDocument;
  contactList = contactList && contactList.querySelector(clDataContainerSel);

  if(!contactList) {
    setTimeout(monitorContactList, 2000);
    return;
  }

  contactListMonitor.observe(contactList);
}


if(locale == 'en-US') {
  webFrame.setSpellCheckProvider(locale, true, new SpellCheckProvider(locale));
  console.log('Spellcheck provided.');
}

document.addEventListener('DOMContentLoaded', monitorContactList);
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector(logoSel).addEventListener('click', (e) => {
    e.preventDefault();
  });
});

contactListMonitor.on('contact-list-update', (contacts) => {
  ipcRenderer.sendToHost('contact-list-update', contacts);
});

contactListMonitor.on('contact-update', (contact) => {
  ipcRenderer.sendToHost('contact-update', contact);
});
