'use strict';

const spellchecker = require('spellchecker');

module.exports = {
  spellCheck: function(text) {
    return !spellchecker.isMisspelled(text);
  }
}
