var socket = io();

const countOnlineEl = document.getElementById("online-count");
const chatInputEl = document.getElementById("chat-input");
const chatMessagesEl = document.querySelector(".chat-messages");
const inputMessageEl = document.getElementById("input-message");

const username = prompt("Please enter username: ");

const ENTER_KEY_CODE = 13;

// Socket.io logic
socket.emit("new-connection", username);

socket.on("count-online", (data) => {
  countOnlineEl.textContent = data;
});

socket.on("received-message", (message) => {
  const isCurrentUserMessage = message.includes(username);
  const li = document.createElement("li");
  if (isCurrentUserMessage) {
    li.style.marginLeft = "70%";
  }
  li.textContent = message;
  chatMessagesEl.appendChild(li);
});

socket.on("user-typing", (username) => {
  inputMessageEl.textContent = `${username} is typing...`;
  setTimeout(() => {
    inputMessageEl.textContent = "";
  }, 2500);
});

// Element Events
chatInputEl.addEventListener("keypress", (event) => {
  socket.emit("user-typing");
  if (event.keyCode === ENTER_KEY_CODE) {
    socket.emit("send-message", chatInputEl.value);
    chatInputEl.value = "";
  }
});
