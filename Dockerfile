# Stage 1: Build the application
FROM node:18-alpine AS build

# Set the working directory inside the 'Web' folder
WORKDIR /app

# Enable Corepack and install Yarn
RUN corepack enable
RUN corepack prepare yarn@4.1.0 --activate

# Copy only the 'Web' folder into the container
COPY ./Web ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Build the application
RUN yarn build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Set default PORT if not provided
ENV PORT 3333

# Copy built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the Nginx template configuration
COPY ./Web/default.conf.template /etc/nginx/templates/default.conf.template

# Create a custom mime.types file
COPY ./Web/mime.types /etc/nginx/mime.types

# Expose the port
EXPOSE $PORT

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]