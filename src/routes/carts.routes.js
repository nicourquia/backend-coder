const express = require('express');
const CartManager = require('../managers/CartManager');
const router = express.Router();

const cartManager = CartManager('./carts.json');

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await cartManager.getCartById(id);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

router.post('/:id/product/:productId', async (req, res) => {
  try {
    const { id, productId } = req.params;
    const updatedCart = await cartManager.addProductToCart(id, productId);
    if (!updatedCart) {
      return res.status(404).json({ error: 'Carrito o producto no encontrado' });
    }
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

module.exports = router;
