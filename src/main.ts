import 'reflect-metadata';
import { app } from './app';
import { prisma } from './infra/prisma/prismaClient';

const port = process.env.PORT ?? 3000;

async function bootstrap() {
  await prisma.$connect();
  console.log('Conexão com o banco de dados estabelecida com sucesso.');

  app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Falha ao conectar com o banco de dados:', err);
  process.exit(1);
});
