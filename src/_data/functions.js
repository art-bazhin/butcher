const phoneNumber = require('libphonenumber-js');
const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt({
  html: true
});

module.exports = {
  markdown:  text => markdown.render(text),
  phone: phoneNumber.parsePhoneNumberFromString
};