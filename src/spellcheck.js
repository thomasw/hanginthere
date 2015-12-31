const webFrame = require('web-frame');
const spellchecker = require('spellchecker');

webFrame.setSpellCheckProvider("en-US", true, {
  spellCheck: function(text) {
    return !spellchecker.isMisspelled(text);
  }
});
