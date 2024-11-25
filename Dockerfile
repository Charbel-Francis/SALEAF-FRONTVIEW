# Stage 1: Build the application
FROM node:18-alpine AS build
WORKDIR /app

RUN corepack enable
RUN corepack prepare yarn@4.1.0 --activate

COPY Web/package.json Web/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY Web/ ./
RUN yarn install --frozen-lockfile
RUN yarn build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine
ENV PORT=3333
WORKDIR /usr/share/nginx/html

# Copy the built assets
COPY --from=build /app/dist .

# Create nginx configuration directory
RUN mkdir -p /etc/nginx/templates

# Copy the nginx configuration template
COPY Web/default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE ${PORT}

# Use a direct command instead of a script
CMD /bin/sh -c 'envsubst "\$PORT" < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g "daemon off;"'