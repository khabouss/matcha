# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port Nuxt listens on
EXPOSE 3000

# Start the application with development mode (which includes HMR)
CMD ["npm", "run", "dev"]
