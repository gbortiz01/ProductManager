const socket = io();

socket.on('message-all', (data) => {
  console.log(data);
  render(data);
});

const render = (data) => {
  const html = data.map(elem => {
    return (
      `
      <div>
        <strong>${elem.user}</strong> dice <em>${elem.message}</em>
      </div>
      `
    );
  }).join('');
  document.getElementById('caja').innerHTML = html;
};

const addMessage = () => {
  const msg = {
    author: document.getElementById('name').value,
    text: document.getElementById('text').value
  };
  socket.emit('new-message', msg);
  document.getElementById('text').value = ''; 
  return false;
};

