const phoneNumber = require('libphonenumber-js');
const MarkdownIt = require('markdown-it');
const Intl = require('intl');
const formatter = new Intl.NumberFormat('ru');
const markdown = new MarkdownIt({
  html: true
});

function formatTitle(title) {
  if (!title) return title;

  const split = title.split(' ');
  
  for (let i = 0; i < split.length; i++) {
    if (split[i].indexOf('/') >= 0) {
      split[i] = `<span style="white-space: nowrap">${split[i]}</span>`;
    }
  }

  return split.join(' ');
}

module.exports = {
  markdown:  text => markdown.render(text),
  formatNumber: num => formatter.format(num),
  formatTitle,
  phone: num => phoneNumber.parsePhoneNumberFromString(num, 'RU').formatNational()
};