FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only the files necessary for React
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy React source code
COPY ./resources/js ./resources/js

# Expose Vite's development server port
EXPOSE 5173

