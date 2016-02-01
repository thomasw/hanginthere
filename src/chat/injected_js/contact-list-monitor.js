'use strict';

const EventEmitter = require('events');
const util = require('util');
const _ = require('lodash');

class Contact {
  constructor(config) {
    this.node = config.node;

    this.name = this._getName();
    this.iconURL = this._getIconURL();
    this.text = this._getText();
    this.isMarkedNew = this._isMarkedNew();
    this.age = this._getAge();
    this.id = this.node.id;
    this.unreadCount = this._getUnreadCount();

    delete this.node;
  }

  _querySelector(query) {
    return this.node.querySelector(query);
  }

  _getName() {
    return this._querySelector('.lt.mG.mG').innerText;
  }

  _getIconURL() {
    return this._querySelector('.n291pb.uaxL4e img').getAttribute('src');
  }

  _getTextNode() {
    return this._querySelector('.ng.sQR2Rb');
  }

  _getText() {
    return this._getTextNode().innerText;
  }

  _isMarkedNew() {
    return this._querySelector('button').classList.contains('ee');
  }

  _getAge() {
    return this._querySelector('.sV').innerText;
  }

  _getUnreadCount() {
    if (!this._isMarkedNew()) { return 0; }

    let label = this._querySelector('.lt.mG.mG').getAttribute('aria-label');
    let match = label.match(/(\d+) unread messages/i);

    if (!match && this._isMarkedNew()) {
      return 1;
    }

    return parseInt(match[1]);
  }
}


class ContactListMonitor {
  constructor(config) {
    this._Observer = config.Observer;
    this.contactList = null;

    this.observer = new this._Observer(this._parseMutations.bind(this));
  }

  observe(target) {
    console.log('Monitoring Contact List for new messages.');

    this.contactList = target;

    this.observer.observe(target, {childList: true});

    this.emit('contact-list-update', this.getContactList());
  }

  stop() {
    this.observer.disconnect();

    console.log('Contact List monitoring ended.');
  }

  _parseMutations() {
    this.emit('contact-list-update', this.getContactList());
  }

  getContactList() {
    return _.map(this.contactList.children, node => {
      let contact;

      if(_.includes(this.badNodes, node.id)) {
        return;
      }

      try {
        contact = new Contact({node: node});
      } catch (e) {
        console.error(e);
        console.log('Ignoring bad node.', node.id);
      }

      return contact;
    });
  }
}
util.inherits(ContactListMonitor, EventEmitter);

module.exports = ContactListMonitor;
