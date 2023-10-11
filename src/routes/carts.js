import express from 'express';
import fs from 'fs';

const router = express.Router();
const CARTS_FILE = 'carrito.json';

// Crea un carrito
router.post('/', (req, res) => {
    const newCart = {
      id: Math.floor(Math.random() * 1000),
      products: [],
    };
  
    const carts = JSON.parse(fs.readFileSync(CARTS_FILE, 'utf-8'));
    carts.push(newCart);
    fs.writeFileSync(CARTS_FILE, JSON.stringify(carts, null, 2));
  
    res.status(201).json(newCart);
  });
  
  // Obtiene los productos de un carrito
  router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const carts = JSON.parse(fs.readFileSync(CARTS_FILE, 'utf-8'));
    const cart = carts.find((c) => c.id === cartId);
  
    if (!cart) {
      res.status(404).json({ message: 'Carrito no encontrado' });
    } else {
      res.json(cart.products);
    }
  });
  
// Agrega un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);

  const quantity = 1;
  
    const carts = JSON.parse(fs.readFileSync(CARTS_FILE, 'utf-8'));
    const cart = carts.find((c) => c.id === cartId);
  
    if (!cart) {
      res.status(404).json({ message: 'Carrito no encontrado' });
    } else {
      const existingProduct = cart.products.find((p) => p.product === productId);
  
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ product: productId, quantity });
      }
  
      fs.writeFileSync(CARTS_FILE, JSON.stringify(carts, null, 2));
      res.json(cart.products);
    }
  });
  
export default router;
