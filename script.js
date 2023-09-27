const chatInput = document.querySelector("#chat-input");
const sendBtn = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeBtn = document.querySelector("#theme-btn");
const deleteBtn = document.querySelector("#delete-btn");

let userText = null;
// const API_KEY = "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";
const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalstorage = () => {
  document.body.classList.toggle("light-mode", localStorage.getItem("theme-color")==="light-mode");

  const defaultText = `<div class="default-text"><h1>ChatGPT Clone</h1>
                        <p>Right now, it is not connected to the API.<br><br><br><br><b>Cloned by Surendra Kumar.<b> </p>
                        </div>`;

  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

loadDataFromLocalstorage();

const createElement = (html, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = html;
  return chatDiv;  //Return the created chat div
};

const getChatResponse = async(incomingChatDiv)=>{
    // const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");

    // Define the properties and data for the API request
    // const requestOptions = {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${API_KEY}`
    //     },
    //     body: JSON.stringify({
    //         "model": "text-davinci-003",
    //         "prompt": userText,
    //         "max_tokens": 7,
    //         "temperature": 0
    //     })
    // }
    try {
        const response = await (await fetch("./api.json")).json();
        pElement.textContent = response.text.trim();
    } catch(error){
      pElement.textContent.add("error")
      pElement.textContent = "Oops! Something went wrong while retrieving the response. Please try again."
    }

    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("all-chats",chatContainer.innerHTML);

}

const copyResponse = (copyBtn) => {
  const responseTextElement = copyBtn.parentElement.querySelector("p");
  navigator.clipboard.writeText(responseTextElement.textContent);
  const copyBtnAnim = copyBtn.children[0].children[0];
  copyBtnAnim.setAttribute("xlink:href","./svgfile.svg#icon-done");
  setTimeout(()=> copyBtnAnim.setAttribute("xlink:href","./svgfile.svg#icon-copy") , 1000);
}

const showTypingAnimation = () => {
  const html = ` <div class="chat-content">
    <div class="chat-details">
        <img src="./images/chatbot.webp" alt="">
        <div class="typing-animation">
            <div class="typing-dot" style="--delay:0.2s"></div>
            <div class="typing-dot" style="--delay:0.3s"></div>
            <div class="typing-dot" style="--delay:0.4s"></div>
           </div>
    </div>
    <span onclick="copyResponse(this)" class="icon-copy">
    <svg><use xlink:href="./svgfile.svg#icon-copy"></use></svg></span>
</div>`;
// Create an incoming chat div with typing animation and append it to chat container
  const incomingChatDiv = createElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  getChatResponse(incomingChatDiv);
};

const handleOutgoingChat = () => {
  userText = chatInput.value.trim();
  if(!userText) return; //If chatInput is empty return from here
  chatInput.value = "";
  chatInput.style.height = `${initialHeight}px`;
  const html = `<div class="chat-content">
       <div class="chat-details">
           <img src="./images/user.webp" alt="">
           <p></p>
       </div>
   </div>`;
//    create an outgoing chat div and append it to chat container
  const outgoingChatDiv = createElement(html, "outgoing");
  outgoingChatDiv.querySelector("p").textContent = userText;
  document.querySelector('.default-text')?.remove();
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showTypingAnimation, 400);
};

themeBtn.addEventListener("click",()=>{
  document.body.classList.toggle("light-mode");
  localStorage.setItem("theme-color",document.body.classList.contains("light-mode") ? "light-mode" : "dark-mode");
});

deleteBtn.addEventListener("click",()=>{
  if(localStorage.getItem("all-chats")===null) return;
  if(confirm("Batana, delete kar du!")) {
    localStorage.removeItem("all-chats");
    loadDataFromLocalstorage();
  }
})

chatInput.addEventListener("input",(e)=>{
  // Adjust the height of the input field dynamically based on its content
  chatInput.style.height = `${initialHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown",(e)=>{
  // If the key is pressed without Shift and the window width is larger
  // than 800 pixels, handle the outgoing chat
  if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleOutgoingChat();
  }
})
sendBtn.addEventListener("click", handleOutgoingChat);


