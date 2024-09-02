document.addEventListener('DOMContentLoaded', () => {
  const chatBox = document.getElementById('chat-box');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');

  sendButton.addEventListener('click', async () => {
    const message = userInput.value;
    if (message.trim() === '') return;

    // Display user message
    chatBox.innerHTML += `<div class="chat-message user-message">${message}</div>`;
    userInput.value = '';

    // Send message to server
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userMessage: message })
      });

      const data = await response.json();
      chatBox.innerHTML += `<div class="chat-message assistant-message">${data.reply}</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
      console.error('Error:', error);
    }
  });

  userInput.addEventListener('input', () => {
    sendButton.disabled = userInput.value.length > 150;
  });
});
