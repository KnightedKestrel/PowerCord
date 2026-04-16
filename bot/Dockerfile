# syntax=docker/dockerfile:1

# TODO: Build and run from dist

ARG NODE_VERSION=24.2.0
ARG PNPM_VERSION
FROM node:${NODE_VERSION}-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare "pnpm@${PNPM_VERSION}" --activate

WORKDIR /app

# hadolint ignore=DL3059
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-workspace.yaml,target=pnpm-workspace.yaml \
    --mount=type=bind,source=bot/package.json,target=bot/package.json \
    --mount=type=bind,source=web/package.json,target=web/package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter powercord-bot

# Delayed prod env to ensure ts-node is installed from dev
ENV NODE_ENV=production
COPY bot/ ./bot/
WORKDIR /app/bot
USER node
EXPOSE 3000
CMD ["pnpm", "start"]
