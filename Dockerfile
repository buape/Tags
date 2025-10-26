FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY prisma ./prisma/

RUN pnpm exec prisma generate

COPY . .

RUN pnpm run build

EXPOSE 8020

CMD ["pnpm", "start"]
