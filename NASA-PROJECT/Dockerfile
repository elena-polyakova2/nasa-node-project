FROM node:18-alpine

WORKDIR /app

# Copy package.json files for both client and server
COPY package*.json ./
COPY client/package*.json client/
COPY server/package*.json server/

# Install client dependencies
RUN cd client && npm install --no-package-lock

# Install server dependencies
RUN npm install --prefix server --no-package-lock

# Copy client and server source code
COPY client/ client/
COPY server/ server/

# Build client application
RUN cd client && npm run build --no-prefix

USER node

CMD [ "npm", "start", "--prefix", "server" ]

EXPOSE 8000