# syntax=docker/dockerfile:1

# TODO: Build and run from dist

ARG NODE_VERSION=24.2.0
FROM node:${NODE_VERSION}-alpine
WORKDIR /app
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
# Delayed prod env to ensure ts-node is installed from dev
ENV NODE_ENV production
COPY . .
USER node
EXPOSE 3000
CMD npm start
