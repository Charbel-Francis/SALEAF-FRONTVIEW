# Stage 1: Build the application
FROM node:18-alpine AS build
WORKDIR /app

# Enable Corepack and install Yarn
RUN corepack enable
RUN corepack prepare yarn@4.1.0 --activate

# Copy package files first
COPY Web/package.json Web/yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY Web/ ./

# List directory to debug
RUN ls -la

# Install dependencies again to ensure everything is in place
RUN yarn install --frozen-lockfile

# Build the application
RUN yarn build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine
ENV PORT 80

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html
COPY Web/default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE $PORT