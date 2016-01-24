'use strict';

const EventEmitter = require('events');
const util = require('util');

class Message {
  constructor(config) {
    this.node = config.node;

    this.name = this._getName();
    this.iconURL = this._getIconURL();
    this.text = this._getText();
    this.isMarkedNew = this._isMarkedNew();
    this.age = this._getAge();
    this.userNotified = this._userNotified();
  }

  markNotified() {
    /*
    To indicate we've fired a notification for a message, we inject a dom
    element to flag it in a ocation we know will be entirely wiped out whenever
    the hangouts window gets a new message. I initially attempted to use data
    attributes for this on the text container, but this element isn't
    removed/readded when new messages are received. The read state would
    persists using that approach.
    */
    var readMarker = document.createElement('span');
    readMarker.classList.add('hit_marked_notified');

    this._getTextNode().appendChild(readMarker);

    this.userNotified = true;
  }

  _querySelector(query) {
    return this.node.querySelector(query);
  }

  _userNotified() {
    return this._querySelector('.hit_marked_notified') !== null;
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

    this._getTopMessage().markNotified();

    this.observer.observe(target, {childList: true});
  }

  stop() {
    this.observer.disconnect();

    console.log('Contact List monitoring ended.');
  }

  _parseMutations(mutations) {
    var message = this._getTopMessage();

    if (message.userNotified || !message.isMarkedNew ) {
      return;
    }

    message.markNotified();

    this.emit('message-received', message);
  }

  _getTopMessage() {
    var newTopNode = this.contactList.firstChild;

    if (!newTopNode || newTopNode.className !== 'c-P yd PH') {
      return null;
    }

    return new Message({node: newTopNode});
  }
}
util.inherits(ContactListMonitor, EventEmitter);

module.exports = ContactListMonitor;
