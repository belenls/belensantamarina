/********************************/
/*           MESSAGES           */
/********************************/

const messagesForm = document.getElementById('messages');
let messageTextarea;
let messageCharCountSpan;

const obfuscateMessage = (message) => {
  const validChars = /^[0-9A-Z:¡!¿?().";/]+$/;

  const messageChars = message
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split('');
  const messageCharsCount = messageChars.reduce((count, char) => {
    if (validChars.test(char)) {
      count[char] = (count[char] || 0) + 1;
    }
    return count;
  }, {});

  const messageCharsCountSorted = Object.entries(messageCharsCount).sort(
    ([, valueA], [, valueB]) => valueB - valueA,
  );

  return messageCharsCountSorted;
};

if (messagesForm) {
  messageTextarea = document.getElementById('message');
  messageCharCountSpan = document.getElementById('messageCharCount');

  const maxChars = 140;

  messageTextarea.addEventListener('input', () => {
    const nonSpaceChars = messageTextarea.value.replace(/\s/g, '');
    if (nonSpaceChars.length > maxChars) {
      let truncatedValue = '';
      let count = 0;

      for (let char of messageTextarea.value) {
        if (char !== ' ' && char !== '\t' && char !== '\n' && char !== '\r') {
          count++;
        }
        if (count > maxChars) {
          break;
        }
        truncatedValue += char;
      }
      messageTextarea.value = truncatedValue;
    }
    const currentLength = messageTextarea.value.replace(/\s/g, '').length;
    messageCharCountSpan.textContent = `${currentLength}/${maxChars}`;
  });

  messagesForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const messagesFormData = new FormData(messagesForm);
    const messagesFormDataObject = Object.fromEntries(messagesFormData);

    const sentMessage = {
      ...messagesFormDataObject,
      obfuscated: obfuscateMessage(messagesFormDataObject.message),
    };

    console.log(sentMessage);
  });
}
