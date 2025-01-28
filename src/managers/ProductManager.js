const fs = require('fs/promises');

const ProductManager = (path) => {
  const getAll = async () => {
    try {
      const data = await fs.readFile(path, 'utf-8');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      return [];
    }
  };

  const getById = async (id) => {
    try {
      const products = await getAll();
      return products.find((product) => product.id === Number(id)) || null;
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      throw error;
    }
  };

  const addProduct = async (product) => {
    try {
      const products = await getAll();
      const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        ...product,
      };
      products.push(newProduct);
      await fs.writeFile(path, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      throw error;
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const products = await getAll();
      const index = products.findIndex((product) => product.id === Number(id));
      if (index === -1) return null;

      products[index] = { ...products[index], ...updatedFields };
      await fs.writeFile(path, JSON.stringify(products, null, 2));
      return products[index];
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const products = await getAll();
      const updatedProducts = products.filter((product) => product.id !== Number(id));
      await fs.writeFile(path, JSON.stringify(updatedProducts, null, 2));
      return true;
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      throw error;
    }
  };

  return {
    getAll,
    getById,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};

module.exports = ProductManager;
