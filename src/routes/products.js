import express from 'express';
import fs from 'fs';

const router = express.Router();
const PRODUCTS_FILE = 'productos.json';

// Obtiene los productos del json
router.get('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
  const limit = parseInt(req.query.limit);

  if (limit && limit > 0) {
    const limitedProducts = products.slice(0, limit);
    res.json(limitedProducts);
  } else {
    res.json(products);
  }
});
  
  // Obtiene un producto por su ID
  router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    const product = products.find((p) => p.id === parseInt(productId));
  
    if (!product) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      res.json(product);
    }
  });
  
  // Agrega un nuevo producto
  router.post('/', (req, res) => {
    const newProduct = req.body;
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
  
    // Genera ID
    const lastProductId = products.length > 0 ? products[products.length - 1].id : 0;
    newProduct.id = lastProductId + 1;
  
    products.push(newProduct);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  
    res.status(201).json(newProduct);
  });
  
  // Actualiza un producto por su ID
  router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body;
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
  
    const index = products.findIndex((p) => p.id === productId);
  
    if (index === -1) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      products[index] = { ...products[index], ...updatedProduct };
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  
      res.json(products[index]);
    }
  });
  
  // Elimina un producto por su ID
  router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
  
    const index = products.findIndex((p) => p.id === productId);
  
    if (index === -1) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      products.splice(index, 1);
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  
      res.json({ message: 'Producto eliminado' });
    }
  });
  
export default router;
