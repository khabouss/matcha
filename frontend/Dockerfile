# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Clean up any existing socket files
RUN rm -rf /tmp/nitro/*

# Expose the port Nuxt listens on
EXPOSE 3002

# Set environment variables
ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=3002

CMD ["npm", "run", "dev"]
