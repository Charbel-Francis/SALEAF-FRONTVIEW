# Stage 1: Build the application
FROM node:18-alpine AS build
WORKDIR /app
RUN corepack enable
RUN corepack prepare yarn@4.1.0 --activate

# Copy package files first for better caching
COPY Web/package.json Web/yarn.lock ./

RUN yarn install --frozen-lockfile

# Then copy the rest of the files
COPY Web/ .

RUN yarn build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine
ENV PORT 80

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html
COPY Web/default.conf.template /etc/nginx/templates/default.conf.template

# Make sure files exist and permissions are correct
RUN ls -la /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE $PORT