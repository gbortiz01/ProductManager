let socket = io();
let products = []; 

socket.on('products', (data) => {
  renderProducts(data);
});

function renderProducts(data) {
  const html = data.map((product) => {
    return (`
      <div>
        <strong>${product.title}</strong>
        <em>${product.price}</em>
      </div>
    `);
  }).join(' ');

  document.getElementById('caja').innerHTML = html;
}

function addProduct(newProduct) {
  products.push(newProduct);
  socket.emit('new-product', newProduct);
  renderProducts(products);
}

socket.on('new-product', (data) => {
  console.log(data);
  addProduct(data);;  
});

function addMessage() {
  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const newProduct = { title, price };
  addProduct(newProduct); 
  return false; 
}
