import 'reflect-metadata';
import { app } from './app';

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API rodando em http://localhost:${port}`);
});
