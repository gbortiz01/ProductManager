const fs = require('fs');

class ProductManager {
    constructor() {
      this.Path();
      this.idCounter = this.Products.length ? Math.max(...this.Products.map(p => p.id)) + 1 : 1;
    }

  Path(){
    try {
      const data = fs.readFileSync('./products.json', 'utf-8');
      this.Products = JSON.parse(data);
    } catch (err) {
      console.log('No hay productos disponibles');
    }
  }

  saveProducts(){
    const data = JSON.stringify(this.Products, null, 2);
    fs.writeFileSync('./products.json', data, 'utf-8');
  }
  
    getProduct() {
      console.log(this.Products);
    }
  
   async addProduct(title, description, price, thumbnail, code, stock) {
      if (!title || !price || !description || !thumbnail || !code || !stock) {
        console.log("Deben completar todos los campos");  
      }
  
      if (this.Products.some((p) => p.code === code)) {
        console.log(`El producto ${title} ya existe`);
      } else {
        let newProduct = {
             id: this.idCounter++,
             title,
             description, 
             price, 
             thumbnail, 
             code, 
             stock };
        this.Products.push(newProduct);
        console.log(`El nuevo producto ${title} se agregó correctamente`);
      }
      this.saveProducts();
    }
  
    getProductByCode(code) {
      let product = this.Products.find((p) => p.code === code);
  
      if (!product) {
        console.log(`No existe el producto con el código ${code}`);
      } else {
        console.log(product);
      }
    }
  
    getProductById(id) {
      let product = this.Products.find((p) => p.id === id);
  
      if (!product) {
        console.log(`Not Found`);
      } else {
        console.log(product);
      }
    }
    updateProduct(id, updatedFields) {
      const productIndex = this.Products.findIndex((p) => p.id === id);
  
      if (productIndex !== -1) {
        delete updatedFields.id;
  
        Object.assign(this.Products[productIndex], updatedFields);
        this.saveProducts();
        console.log(`Producto con ID ${id} actualizado correctamente.`);
      } else {
        console.log(`No se encontró un producto con el ID ${id}. La actualización no se realizó.`);
      }
    }

    deleteProduct(id) {
      const productIndex = this.Products.findIndex((p) => p.id === id);
  
      if (productIndex !== -1) {
        this.Products.splice(productIndex, 1);
        this.saveProducts();
        console.log(`Producto con ID ${id} eliminado correctamente.`);
      } else {
        console.log(`No se encontró un producto con el ID ${id}. No se realizó la eliminación.`);
      }
    }
  }
 
  const Product = new ProductManager();

  //TESTING DE CODIGO

  Product.addProduct("Jeans Elastisado ", "Jeans elastizado para un look moderno casual", 3999.99, "url_imagen_jeans.jpg", "J006", 30);

  console.log("---Verificador de Code--------");
  
  Product.getProductByCode("C001");

  console.log("----Busqueda por ID------");

  Product.getProductById(5);
  Product.getProductById(8);

  console.log("---Verificador de Actualizacion de codigo--------");


  Product.updateProduct(1, { code: "C009" });

  console.log("---Verificador de Delete--------");
  Product.deleteProduct(3)

  