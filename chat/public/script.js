document.addEventListener('DOMContentLoaded', () => {
  const socket = io(); // Assumes the server is hosted on the same domain

  const messageList = document.getElementById('message-list');
  const messageInput = document.getElementById('message-input');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const signupButton = document.getElementById('signup-button');
  const logoutButton = document.getElementById('logout-button');
  const chatContainer = document.getElementById('chat-container');
  const sendButton = document.getElementById('send-button');

  let username = ''; // Store the username

  // Function to handle user login
  const handleLogin = async (event) => {
    event.preventDefault();
    const enteredUsername = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
  
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: enteredUsername, password }),
    });
  
    const data = await response.json();
    if (data.success) {
      alert('Login successful!');
      document.getElementById('loginModal').style.display = 'none'; // Close the modal
      chatContainer.style.display = 'block';
      username = enteredUsername; // Store the username
    } else {
      alert('Login failed: ' + data.message);
    }
  };
  
  const handleSignup = async (event) => {
    event.preventDefault();
    const enteredUsername = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
  
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: enteredUsername, password }),
    });
  
    const data = await response.json();
    if (data.success) {
      alert('Signup successful!');
      document.getElementById('signupModal').style.display = 'none'; // Close the modal
      chatContainer.style.display = 'block';
      username = enteredUsername; // Store the username
    } else {
      alert('Signup failed: ' + data.message);
    }
  };
  

  // Event listener for login form
  loginForm.addEventListener('submit', handleLogin);

  // Event listener for signup button
  signupButton.addEventListener('click', handleSignup);

  // Event listener for logout button
  logoutButton.addEventListener('click', () => {
    location.reload(); // Reload the page to simulate logout
  });

  // Event listener for message input
  messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  });

  // Event listener for send button
  sendButton.addEventListener('click', sendMessage);

  // Function to send a message
  const sendMessage = () => {
    const message = messageInput.value.trim();
    if (message) {
      appendMessage('You', message, 'sent');
      socket.emit('chat message', { username, message });
      messageInput.value = '';
    }
  };

  // Event listener for receiving a message
  socket.on('chat message', (data) => {
    appendMessage(data.username, data.message, 'received');
  });

  // Function to append a message to the message list
  const appendMessage = (username, message, type) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type);
    messageElement.innerHTML = `<strong>${username}:</strong> ${message}`;
    messageList.appendChild(messageElement);
    messageList.scrollTop = messageList.scrollHeight;
  };
});
