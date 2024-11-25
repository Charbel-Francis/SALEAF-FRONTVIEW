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

COPY --from=build /app/dist .
COPY Web/default.conf.template /etc/nginx/templates/default.conf.template

# Make nginx listen on the Railway PORT
EXPOSE ${PORT}
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'