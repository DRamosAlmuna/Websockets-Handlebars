import express from 'express';
import productsRouter from './src/routes/products.js';
import cartsRouter from './src/routes/carts.js';

const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Lo sentimos!, algo ha salido mal');
  });