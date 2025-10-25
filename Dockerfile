FROM node:22-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY prisma ./prisma/

RUN pnpm exec prisma generate

COPY . .

RUN pnpm run build

EXPOSE 8020

CMD ["pnpm", "start"]
