import { promises as fs } from 'fs' 
import uuid4 from 'uuid4';

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProduct() {
    const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
    return prods;
  }

  async getProductById(id) {
    const fileContent = await fs.readFile(this.path, 'utf-8');
    const prods = JSON.parse(fileContent);
    const prod = prods.find(product => product.id === id);
    return prod;
  }

  async addProduct(productData) {
    const { title, description, price, thumbnail, code, stock } = productData;
    if (!title || !description || !price || !code || !stock) {
      return false;
    }
    const newProduct = {
      id: uuid4(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    const prods = await this.getProduct();
    prods.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(prods, null, 2));
    return true;
  }

  async updateProduct(id, updatedFields) {
    const prods = await this.getProduct();
    const index = prods.findIndex(product => product.id === id);

    if (index !== -1) {
      Object.assign(prods[index], updatedFields);
      await fs.writeFile(this.path, JSON.stringify(prods, null, 2));
      return true;
    } else {
      return false;
    }
  }

  async deleteProduct(id) {
    const prods = await this.getProduct();
    const index = prods.findIndex(product => product.id === id);

    if (index !== -1) {
      prods.splice(index, 1);
      await fs.writeFile(this.path, JSON.stringify(prods, null, 2));
      return true;
    } else {
      return false;
    }
  }
}
