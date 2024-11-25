# Stage 1: Build the application
FROM node:18-alpine AS build
WORKDIR /app
RUN corepack enable
RUN corepack prepare yarn@4.1.0 --activate

# Update the capitalization to match your folder name
COPY Web/ .

RUN yarn install --frozen-lockfile
RUN yarn build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine
ENV PORT 80

# Make sure this path matches your build output directory
COPY --from=build /app/dist /usr/share/nginx/html
# Update the capitalization here too
COPY Web/default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE $PORT