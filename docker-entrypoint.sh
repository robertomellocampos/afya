#!/bin/sh
set -e

echo ">>> Aguardando MySQL ficar disponível na porta 3306..."
until nc -z mysql 3306 2>/dev/null; do
  echo "    MySQL ainda não está pronto, tentando novamente em 2s..."
  sleep 2
done

echo ">>> Porta aberta. Aguardando MySQL finalizar inicialização..."
sleep 8

echo ">>> Rodando migrations..."
npx prisma migrate deploy

echo ">>> Gerando Prisma Client..."
npx prisma generate

echo ">>> Rodando seed..."
npm run db:seed

echo ">>> Subindo API..."
exec npm run dev
