//login elements
const login = document.querySelector(".login")
const loginForm = document.querySelector(".login_form")
const loginInput = document.querySelector(".login_input")

//chat elements
const chat = document.querySelector(".chat")
const chatForm = document.querySelector(".chat_form")
const chatInput = document.querySelector(".chat_input")
const chat_messages = document.querySelector(".chat_messages")

const colors = [
    "cadeblue",
    "orange",
    "green",
    "brown",
    "red",
    "hotpink",
    "gold"
]

const user = { id: "", name: "", color: "" }

let websocket

const createMessageSelfElement = (content) => {

    const div = document.createElement("div");

    div.classList.add("message-self");
    div.innerHTML = content;
    
    return div;
    
}
const createMessageOtherElement = (content, sender, senderColor) => {
    
    const div = document.createElement("div");
    const span = document.createElement("span");

    div.classList.add("message-other");

    div.classList.add("message-self");
    span.classList.add("message-sender");
    span.style.color = senderColor;

    div.appendChild(span);

    span.innerHTML = sender;
    div.innerHTML += content;

    return div;

}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({data}) => {

    const {userId, userName, userColor, content} = (JSON.parse(data));

    const message = userId == user.id 
    ? createMessageSelfElement(content)
    : createMessageOtherElement(content, userName, userColor);


    chat_messages.appendChild(message);
    scrollScreen();
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();

    login.style.display = "none";
    chat.style.display = "flex";


    websocket = new WebSocket("wss://backend-chat-ss58.onrender.com");

    websocket.onmessage = processMessage;


}

const senMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }
    websocket.send(JSON.stringify(message));

    chatInput.value = "";
}

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", senMessage);
