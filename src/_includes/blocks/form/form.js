(function() {
  const form = document.getElementById('form');

  if (!form) return;

  let isPending = false;

  const spam = document.getElementById('spam-check');

  const nameField = document.getElementById('form-field-name');
  const nameInput = nameField.querySelector('input');

  const phoneField = document.getElementById('form-field-phone');
  const phoneInput = phoneField.querySelector('input');

  const messageField = document.getElementById('form-field-message');
  const messageInput = messageField.querySelector('textarea');

  const checkboxField = document.getElementById('form-field-checkbox');
  const checkboxInput = checkboxField.querySelector('input');

  function validateField(field, check) {
    if (check()) {
      field.classList.remove('form__field--invalid');
      return true;
    }

    field.classList.add('form__field--invalid');
    return false;
  }

  function checkNotEmpty(value) {
    if (value.trim().length) return true;
    return false;
  }

  function validateName() {
    return validateField(nameField, () => checkNotEmpty(nameInput.value));
  }

  function validateMessage() {
    return validateField(messageField, () => checkNotEmpty(messageInput.value));
  }

  function validatePhone() {
    return validateField(phoneField, () => checkNotEmpty(phoneInput.value));
  }

  function validateCheckbox() {
    return validateField(checkboxField, () => checkboxInput.checked);
  }

  function validateForm() {
    let result = true;

    result = validateName() && result;
    result = validatePhone() && result;
    result = validateMessage() && result;
    result = validateCheckbox() && result;

    return result;
  }

  nameInput.addEventListener('input', () => validateName());
  messageInput.addEventListener('input', () => validateMessage());
  checkboxInput.addEventListener('input', () => validateCheckbox());

  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/[^\d )(\-+]/gm, '');
    validatePhone();
  });

  function send() {
    const data = {
      name: nameInput.value,
      phone: phoneInput.value,
      message: messageInput.value
    }

    ajax('POST', 'https://formcarry.com/s/5RR14hr9hBQ',
      data,
      () => form.classList.add('form--success'),
      () => form.classList.add('form--error')
    );
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    if (spam.value) return;

    if (isPending) return;
    form.classList.add('form--dirty');
    form.classList.remove('form--error');

    if (validateForm()) send();
  });

  function ajax(method, url, data, success, error) {
    isPending = true;
    form.classList.add('form--pending');
    
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-type', 'application/json');

    xhr.onreadystatechange = function() {
      if (xhr.readyState !== XMLHttpRequest.DONE) return;

      isPending = false;
      form.classList.remove('form--pending');

      if (xhr.status === 200) {
        success(xhr.response, xhr.responseType);
        
      } else {
        error(xhr.status, xhr.response, xhr.responseType);
      }
    };

    xhr.send(JSON.stringify(data));
  }

})();