import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import exphbs from 'express-handlebars';
import path from 'path';

import productsRouter from './src/routes/products.js';
import cartsRouter from './src/routes/carts.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configurar Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configurar rutas
app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para la vista "realTimeProducts.handlebars"
app.get('/realTimeProducts', (req, res) => {
  res.render('realTimeProducts');
});

// Configurar Socket.io para websockets
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado.');

  socket.on('producto-creado', (nuevoProducto) => {
    io.emit('producto-creado', nuevoProducto);
  });

  socket.on('producto-eliminado', (productoEliminado) => {
    io.emit('producto-eliminado', productoEliminado);
  });
});

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Lo sentimos, algo ha salido mal');
});