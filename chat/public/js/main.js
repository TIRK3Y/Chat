document.addEventListener('DOMContentLoaded', () => {
  const socket = io(); // Connect to the server
  const messageList = document.getElementById('message-list');

  // Add event listener for the "Send" button
  document.getElementById('send-button').addEventListener('click', () => {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText) {
      // Emit a message to the server
      socket.emit('chat message', messageText);
      messageInput.value = ''; // Clear the input field
    }
  });

  // Add event listener to handle received messages from the server
  socket.on('chat message', (message) => {
    const listItem = document.createElement('li');
    listItem.textContent = message;
    messageList.appendChild(listItem);

    // Automatically scroll to the bottom of the message list
    messageList.scrollTop = messageList.scrollHeight;
  });
});
