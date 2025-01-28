const express = require('express');
const ProductManager = require('../managers/ProductManager');
const router = express.Router();

const productManager = ProductManager('./products.json');

router.get('/', async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productManager.getById(id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productManager.updateProduct(id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await productManager.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({ message: "Producto eliminado correctamente" }).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;
