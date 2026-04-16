# syntax=docker/dockerfile:1

# TODO: Build and run from dist

ARG NODE_VERSION=24.2.0
FROM node:${NODE_VERSION}-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

# hadolint ignore=DL3059
RUN --mount=type=bind,source=bot/package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# Delayed prod env to ensure ts-node is installed from dev
ENV NODE_ENV=production
COPY bot/ .
USER node
EXPOSE 3000
CMD ["pnpm", "start"]
