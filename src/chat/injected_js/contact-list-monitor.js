'use strict';

const EventEmitter = require('events');
const util = require('util');
const _ = require('lodash');

class Contact {
  constructor(config) {
    this.node = config.node;

    this.position = config.position;
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
    this.contactListNode = null;
    this.badNodes = [];
    this.contactList = [];
    this.contacts = {};

    this._Observer = config.Observer;
    this._observer = new this._Observer(this._parseMutations.bind(this));
  }

  observe(target) {
    console.log('Monitoring Contact List for new messages.');

    this.contactListNode = target;

    this._observer.observe(this.contactListNode, {childList: true});

    this._parseMutations();
  }

  stop() {
    this._observer.disconnect();

    console.log('Contact List monitoring ended.');
  }

  _parseMutations() {
    this.contactList = this._getContactList();
  }

  _getContactList() {
    let cl = _.map(this.contactListNode.children, (node, idx) => {
      this._updateContact(idx, node);
      return node.id;
    });

    return _.difference(cl, this.badNodes);
  }

  _updateContact(idx, contactNode) {
    let contact = this._getOrIgnoreContact(contactNode, idx);

    if(!contact) { return; }
    if(_.isEqual(this.contacts[contact.id], contact)) { return; }

    this.contacts[contact.id] = contact;
    this.emit('contact-update', contact);
  }

  _getOrIgnoreContact(node, position) {
    if (_.includes(this.badNodes, node.id)) { return; }

    try {
      return new Contact({node: node, position: position});
    } catch(e) {
      this._ignoreNode(node, e);
      return;
    }
  }

  _ignoreNode(node, e) {
    console.log(`Bad contact node (${node.id}). Ignoring.`, e);
    this.badNodes.push(node.id);
  }
}
util.inherits(ContactListMonitor, EventEmitter);

module.exports = ContactListMonitor;
