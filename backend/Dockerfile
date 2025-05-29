# backend/Dockerfile
FROM node:18-slim

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install nodemon globally

# Copy package files first to leverage Docker cache
COPY package*.json ./
COPY yarn.lock ./

# Clean install dependencies
RUN rm -rf node_modules

# Copy the rest of the application
COPY . .

EXPOSE 3001

CMD ["sh", "install.sh"]
