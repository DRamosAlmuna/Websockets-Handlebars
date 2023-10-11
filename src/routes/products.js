import express from 'express';
import fs from 'fs';
import { Server } from 'socket.io';

const router = express.Router();
const PRODUCTS_FILE = 'productos.json';

// Socket.io
let io;

// Configurar Socket.io en la ruta /api/products
router.setIO = (socketIO) => {
  io = socketIO;
};

// Emitir un evento para crear un producto en tiempo real
function emitProductCreated(product) {
  if (io) {
    io.emit('producto-creado', product);
  }
}

// Emitir un evento para eliminar un producto en tiempo real
function emitProductDeleted(productId) {
  if (io) {
    io.emit('producto-eliminado', productId);
  }
}

// Obtiene los productos del json
router.get('/', (req, res) => {
  const limit = req.query.limit;
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));

  if (limit) {
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
  const product = products.find((p) => p.id === productId);

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

  // Emitir evento de producto creado en tiempo real
  emitProductCreated(newProduct);

  res.status(201).json(newProduct);
});

// Elimina un producto por su ID
router.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));

  const index = products.findIndex((p) => p.id === productId);

  if (index === -1) {
    res.status(404).json({ message: 'Producto no encontrado' });
  } else {
    const deletedProduct = products.splice(index, 1)[0];
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

    // Emitir evento de producto eliminado en tiempo real
    emitProductDeleted(productId);

    res.json({ message: 'Producto eliminado', deletedProduct });
  }
});

export default router;
