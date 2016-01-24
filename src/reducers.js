'use strict';

const combineReducers = require('redux').combineReducers;
const actions = require('./actions');

function accounts(state, action) {
  if (typeof(state) === 'undefined') { return []; }

  switch (action.type) {
    case actions.UPDATE_ACCOUNTS:
      if (action.accounts.length < state.length) {
        return action.accounts;
      }

      // Google always adds new accounts to the bottm, so we can get always
      // with ignoring however many items are already in the accounts list.
      return [].concat(state, action.accounts.slice(state.length));
    default:
      return state;
  }
}

const reducerCombo = combineReducers({
  'accounts': accounts
});

exports.appReducer = function(state, action) {
  if (action.type === actions.RESET) {
    return reducerCombo();
  }

  return reducerCombo(state, action);
};
