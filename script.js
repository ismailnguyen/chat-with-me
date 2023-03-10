const author = document.querySelector('.chat-authoring');
const scrollview = document.querySelector('.chat-scrollview');
const messagelist = document.querySelector('.chat-messagelist');

const loader_template = `
<div class="chat-cluster">
    <div class="chat-avatar">
      <img src="https://www.ismailnguyen.com/resources/images/favicon.png" alt="">
    </div>
    <section>
      <h3>Me</h3>
      <div class="chat-message chat-loader">
        <span class="dot dot-1"></span>
        <span class="dot dot-2"></span>
        <span class="dot dot-3"></span>
      </div>
    </section>
  </div>
`;

const bot_template = message => `
  <div class="chat-message">${message}</div>
`;

const user_template = message => `
  <div mine class="chat-cluster">
    <section>
      <div class="chat-message">${message}</div>
    </section>
  </div>
`;

scrollview.scrollTop = scrollview.scrollHeight;

function addBotLoader() {
    messagelist.innerHTML += loader_template;
}

function addBotMessage(message) {
    messagelist.querySelector('.chat-loader').outerHTML = bot_template(message);
}

function addAuthorMessage(message) {
    if (messagelist.querySelector('.chat-cluster:last-child') && messagelist.querySelector('.chat-cluster:last-child').hasAttribute('mine')) {
        messagelist.querySelector('.chat-cluster:last-child > section').innerHTML += `<div class="chat-message">${message}</div>`;
    } else {
        messagelist.innerHTML += user_template(message);
    }
}

author.addEventListener('keypress', e => {
    const {
        keyCode
    } = e;

    if (keyCode === 13) {
        e.preventDefault();

        const text = author.innerHTML;

        var headers = new Headers();
        headers.append("Content-Type", "text/plain");

        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: text,
            redirect: 'follow'
        };

        addAuthorMessage(text);
        addBotLoader();

        fetch('./api/chat', requestOptions)
            .then(response => response.text())
            .then(response => {
              if (response.includes('error') && response.includes('timed out')) {
                response = "I'm a little bit busy, can you retry please.";
              }

              addBotMessage(response);
            })
            .catch(error => console.log('error', error));

        author.innerHTML = '';
    }
});

function onload() {
    addBotLoader();

    setTimeout(() => {
        addBotMessage('Hi!');
    }, 500);

    setTimeout(() => {
        addBotLoader();
    }, 1000);

    setTimeout(() => {
        addBotMessage('How can I help you?');
    }, 1500)
}

onload();