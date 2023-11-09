FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy root package.json and install server dependencies
COPY package*.json ./
RUN npm install --no-package-lock

# Set working directory for client
WORKDIR /app/client
# Copy client package.json and install client dependencies
COPY client/package*.json ./
RUN npm install --no-package-lock

# Reset working directory for the root
WORKDIR /app

# Copy server package.json and install server dependencies
COPY server/package*.json server/
RUN npm install --prefix server --no-package-lock

# Set working directory for client (again, optional for clarity)
WORKDIR /app/client
# Build client application
RUN npm run build

# Reset working directory to the root
WORKDIR /app

# Copy client and server source code
COPY client/ client/
COPY server/ server/

# Switch to non-root user for security (if desired)
USER node

# Start the server application
CMD [ "npm", "start", "--prefix", "server" ]

# Expose the port (if necessary)
EXPOSE 8000
