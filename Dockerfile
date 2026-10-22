FROM node:24.22.1-alpine

ARG PNPM_VERSION=8.15.9
ARG PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x

ENV PRISMA_CLI_BINARY_TARGETS=$PRISMA_CLI_BINARY_TARGETS

RUN apk add --no-cache openssl 'ca-certificates>=20261020-r0' \
    && apk upgrade --no-cache ca-certificates-bundle \
    && update-ca-certificates

RUN npm install -g "pnpm@${PNPM_VERSION}"

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --force

COPY prisma ./prisma/

RUN pnpm exec prisma generate

COPY . .

RUN pnpm run build

EXPOSE 8020

CMD ["pnpm", "start"]
