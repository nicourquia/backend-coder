const fs = require('fs/promises');

const CartManager = (path) => {
  const getAllCarts = async () => {
    try {
      const data = await fs.readFile(path, 'utf-8');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      return [];
    }
  };

  const getCartById = async (id) => {
    try {
      const carts = await getAllCarts();
      return carts.find((cart) => cart.id === Number(id)) || null;
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      throw error;
    }
  };

  const createCart = async () => {
    try {
      const carts = await getAllCarts();
      const newCart = {
        id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
        products: [],
      };
      carts.push(newCart);
      await fs.writeFile(path, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      throw error;
    }
  };

  const addProductToCart = async (cartId, productId) => {
    try {
      const carts = await getAllCarts();
      const cart = carts.find((cart) => cart.id === Number(cartId));
      if (!cart) return null;

      const existingProduct = cart.products.find((prod) => prod.product === Number(productId));
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: Number(productId), quantity: 1 });
      }

      await fs.writeFile(path, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      throw error;
    }
  };

  return {
    getAllCarts,
    getCartById,
    createCart,
    addProductToCart,
  };
};

module.exports = CartManager;
