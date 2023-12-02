# Use the official Node.js image as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /book-store

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Run Prisma migrations
RUN npx prisma migrate deploy

# Expose the port that your application will run on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
