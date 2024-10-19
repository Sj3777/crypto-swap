# Dockerfile
# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Copy app source
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=production

# Start the app
CMD ["node", "dist/main"]
