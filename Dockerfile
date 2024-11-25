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
# Make sure we're using the PORT from Railway
ENV PORT=3333
WORKDIR /usr/share/nginx/html

# Copy the built assets
COPY --from=build /app/dist .

# Create nginx configuration directory if it doesn't exist
RUN mkdir -p /etc/nginx/templates

# Copy the nginx configuration template
COPY Web/default.conf.template /etc/nginx/templates/default.conf.template

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --quiet --tries=1 --spider http://localhost:${PORT} || exit 1

# Make nginx listen on the Railway PORT
EXPOSE ${PORT}

# Use proper initialization script
RUN echo '#!/bin/sh\n\
sed -i -e "s/\${PORT}/$PORT/g" /etc/nginx/templates/default.conf.template\n\
envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf\n\
nginx -g "daemon off;"' > /docker-entrypoint.sh && \
chmod +x /docker-entrypoint.sh

CMD ["/docker-entrypoint.sh"]