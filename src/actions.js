'use strict';
/*
 * action types
 */

const UPDATE_ACCOUNTS = 'UPDATE_ACCOUNTS';
const RESET = 'RESET';

exports.UPDATE_ACCOUNTS = UPDATE_ACCOUNTS;
exports.RESET = RESET;

exports.reset = () => {
  return {
    type: RESET
  };
};

exports.updateAccounts = (accounts) => {
  return { type: UPDATE_ACCOUNTS, accounts };
};
