# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the rest of the application files
COPY . .

# Expose the port Nuxt listens on
EXPOSE 3000

CMD ["sh", "install.sh"]
