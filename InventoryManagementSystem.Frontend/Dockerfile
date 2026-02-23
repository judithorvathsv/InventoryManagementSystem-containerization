# ---------- BUILD STAGE ----------
FROM node:25-alpine3.22 AS build
WORKDIR /app

# Run dependencies 
COPY package*.json ./
RUN npm install

# Copy the rest of the codes then build
COPY . .
RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM nginx:1.29.5-perl

# Copy code and the nginx config to finnd static files
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]