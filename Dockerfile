# Use an official Node.js runtime as the base image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and lock files to the container
COPY package.json pnpm-lock.yaml ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files to the container
COPY . .

# Build the React app
RUN npm run build

# Expose the port that the server will listen on
EXPOSE 4173

# Start the application
CMD [ "npm", "run", "preview" ]
