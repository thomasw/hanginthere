'use strict';

const _ = require('lodash');
const EventEmitter = require('events');
const util = require('util');


class Message {
  constructor(config) {
    this.dom_node = config.node;
    this.node = config.node.cloneNode(true);

    this.name = this._getName();
    this.iconURL = this._getIconURL();
    this.text = this._getText();
    this.isMarkedNew = this._isMarkedNew();
    this.age = this._getAge();
  }

  isEqual(message) {
    return (
      this.text === message.text &&
      this.name === message.name &&
      this.age === message.age);
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

  _getText() {
    return this._querySelector('.ng.sQR2Rb').innerText;
  }

  _isMarkedNew() {
    return this._querySelector('button').classList.contains('ee');
  }

  _getAge() {
    return this._querySelector('.sV').innerText;
  }
}


class ContactListMonitor {
  constructor(config) {
    this.contactList = null;
    this.lastMessage = null;

    this.observer = new MutationObserver(this._parseMutations.bind(this));
  }

  observe(target) {
    console.log('Monitoring Contact List for new messages.');

    this.contactList = target;
    this.lastMessage = this._getTopMessage();
    
    this.observer.observe(target, {childList: true});
  }

  stop() {
    this.observer.disconnect();

    console.log('Contact List monitoring ended.');
  }

  _parseMutations(mutations) {
    var message = this._getTopMessage();

    if (!this._isNewMessage(message)) {
      return;
    }

    this.lastMessage = message;
    this.emit('message-received', message);
  }

  _getTopMessage() {
    var newTopNode = this.contactList.firstChild;

    if (!newTopNode || newTopNode.className !== 'c-P yd PH') {
      return null;
    }

    return new Message({node: newTopNode});
  }

  _isNewMessage(message) {
    if (this.lastMessage === null) {
      return message.isMarkedNew && message.age == 'Now';
    }

    return !message.isEqual(this.lastMessage) && message.isMarkedNew;
  }
}

util.inherits(ContactListMonitor, EventEmitter);

module.exports = ContactListMonitor
