import Product from './dao/db/models/product.model.js';
import Cart from './dao/db/models/cart.model.js';

export class ProductManager {
  async getProducts(queryParams) {
    try {
      const { limit = 10, page = 1, sort, query } = queryParams;

      const filter = {};
      if (query) {
        if (query.startsWith('category:')) {
          const category = query.split(':')[1];
          filter.category = category;
        }
        if (query === 'available') {
          filter.availability = true;
        }
      }

      const totalProducts = await Product.countDocuments(filter);

      const totalPages = Math.ceil(totalProducts / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      const sortOption = sort === 'desc' ? -1 : 1;
      const sortCriteria = { price: sortOption };

      const products = await Product.find(filter)
        .sort(sortCriteria)
        .limit(limit)
        .skip((page - 1) * limit);

      const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}` : null;
      const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}` : null;

      return {
        status: 'Productos Encontrados',
        payload: products,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      };
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return { status: 'error', error: 'Error interno del servidor' };
    }
  }
  
  async getProductById(id) {
    return await Product.findById(id);
  }

  async addProduct(productData) {
    const { title, description, price, thumbnail, code, stock } = productData;
    if (!title || !description || !price || !code || !stock) {
      return false;
    }
    const newProduct = new Product({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });
    await newProduct.save();
    return true;
  }

  async updateProduct(id, updatedFields) {
    try {
      await Product.findByIdAndUpdate(id, updatedFields);
      return 'Producto Actualizo';
    } catch (error) {
      return 'No se pudo actualizar producto';
    }
  }

  async deleteProduct(id) {
    try {
      await Product.findByIdAndDelete(id);
      return 'Producto Eliminado';
    } catch (error) {
      return 'No se ha podido eliminar producto';
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      let cart = await Cart.findById(cartId);
      if (!cart) {
        const currentDate = new Date().toISOString(); // Obtenemos la fecha actual
        cart = new Cart({ date: currentDate }); // Creamos un nuevo carrito con la fecha actual
      }
  
      const product = await this.getProductById(productId);
      if (!product) {
        return false;
      }
  
      const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity++;
      } else {
        cart.products.push({ product: productId });
      }
  
      await cart.save();
      return true;
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      return false;
    }
  }
  

  
}
