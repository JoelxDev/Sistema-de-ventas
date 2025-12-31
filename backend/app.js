import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Backend OK');
});

app.listen(3200, () => {
  console.log('Backend corriendo en puerto 3200');
});
