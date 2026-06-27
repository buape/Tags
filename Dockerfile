FROM node:20-alpine

RUN apk add --no-cache openssl

RUN npm install -g pnpm@8.15.9

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --force

COPY prisma ./prisma/

RUN pnpm exec prisma generate

COPY . .

RUN pnpm run build

EXPOSE 8020

CMD ["pnpm", "start"]
