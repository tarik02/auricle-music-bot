FROM node:22-slim AS base

RUN apt-get update && apt-get install -y ffmpeg
RUN corepack enable

WORKDIR /usr/app

COPY .yarnrc.yml .
COPY .yarn/releases/ .yarn/releases/


FROM base AS node_modules

RUN apt-get install -y build-essential python3 make

COPY package.json .
RUN yarn install && mv node_modules node_modules_dev
RUN yarn workspaces focus --all --production && mv node_modules node_modules_prod


FROM base AS builder

COPY . .
COPY --from=node_modules /usr/app/node_modules_dev ./node_modules

RUN yarn build


FROM base

WORKDIR /usr/app

COPY package.json .

COPY --from=builder /usr/app/dist ./dist
COPY --from=node_modules /usr/app/node_modules_prod ./node_modules

CMD ["node", "dist/index.js"]
