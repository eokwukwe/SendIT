/* eslint-disable */

class Util {
  static showSnackbar(element, color, textContent) {
    element.className = 'show';
    element.style.backgroundColor = color;
    element.textContent = textContent;
    setTimeout(function() {
      element.className = element.className.replace('show', '');
    }, 3000);
  }

  static showSpinner(element) {
    element.style.visibility = 'visible';
  }

  static hideSpinner(element) {
    element.style.visibility = 'hidden';
  }

  static async doFetch(input, settings = {}) {
    const response = await fetch(input, {
      headers: {
        Accept: 'application/json, text/plain, */**',
        'Content-Type': 'application/json'
      },
      ...settings
    });
    return response;
  }
}
