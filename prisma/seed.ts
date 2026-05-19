import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'teste@afya.com';
  const existing = await prisma.usuario.findUnique({ where: { email } });

  if (existing) {
    console.log('Usuário de teste já existe, pulando seed.');
    return;
  }

  const senha = await bcrypt.hash('teste123', 10);
  await prisma.usuario.create({
    data: { nome: 'Usuário Teste', email, senha },
  });

  console.log('Usuário de teste criado:');
  console.log('  email: teste@afya.com');
  console.log('  senha: teste123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
