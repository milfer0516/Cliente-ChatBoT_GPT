import "./style.css";
import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.getElementById("chat_container");
const outPutElement = document.getElementById("output");
//Url API
const URL_API = "https://milfer-chat-bot.onrender.com/find-chatBot";

let loadInterval;

function loader(element) {
	element.textContent = "";

	loadInterval = setInterval(() => {
		element.textContent += ".";

		if (element.textContent === "..........") {
			element.textContent = "";
		}
	}, 300);
}

function typeText(element, text) {
	let index = 0;

	let interval = setInterval(() => {
		if (index < text.length) {
			element.innerHTML += text.charAt(index);
			index++;
		} else {
			clearInterval(index);
		}
	}, 20);

	return interval;
}

function generateUniqueId() {
	const timeStamp = Date.now();
	const randorNumber = Math.random();
	const hexadecimalString = randorNumber.toString(16);
	//console.log(`id-${timeStamp}-${hexadecimalString}`);
	return `id-${timeStamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniquedId) {
	return `
      <div class="wrapper">
        <div class="chat">
          <div class="profile">
            <img 
              src="${isAi ? bot : user}"
              alt="${isAi ? "bot" : "user"}"
            />
          </div>
          <div class"message" id=${uniquedId}>${value}</div>
        </div>
      </div>
    `;
}

const handleSubmit = async (e) => {
	e.preventDefault();

	const data = new FormData(form);

	// Usuarios
	chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
	form.reset();

	// Bot's chatStripe
	const uniqueId = generateUniqueId();

	chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

	chatContainer.scrollTop = chatContainer.scrollHeight;
	const messageDiv = document.getElementById(uniqueId);
	console.log(messageDiv);

	loader(messageDiv);

	// Petición a la API con Fetch
	const response = await fetch(URL_API, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			prompt: data.get("prompt"),
		}),
	});
	clearInterval(loadInterval);
	console.log(response);
	messageDiv.innerHTML = "";
	//outPutElement.textContent = response.data.message[0].content;
	if (response.ok) {
		const data = await response.json();
		//console.log(data);
		const parsedData = data.data.trim();
		console.log(parsedData);

		typeText(messageDiv, parsedData);
	} else {
		const error = await response.text();

		messageDiv.innerHTML = "Algo salió mal. Por favor intente otra vez. ";
		alert(error);
	}
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
	if (e.keyCode === 13) {
		handleSubmit(e);
	}
});
