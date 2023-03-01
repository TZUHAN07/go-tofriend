const chatfrom = document.getElementById('chatfrom')
const chatMessages = document.querySelector('.chat-messages') 
const socket = io.connect();

//message to server
socket.on("message", message => {
    console.log( message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight

})

// socket.on('connect',() => {
//   console.log(socket.id)
//   console.log('user connected!')
// });




//message sumbit
chatfrom.addEventListener('submit' , (e)=>{
    e.preventDefault();
    // get message text
    const msg = e.target.elements.msg.value;
    //enit message to server
    socket.emit('chatMessage',msg)

    //clear input
    e.target.elements.msg.value ='';
    e.target.elements.msg.focus();
})

//output message to dom
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text"> ${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

socket.on("disconnect", () => {
    console.log('user disconnected!')
  
  })
