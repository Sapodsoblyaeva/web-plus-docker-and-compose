FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json .

RUN npm i --no-audit --no-fund

COPY . ./

RUN npm run build


FROM nginx:1.23.1-alpine as runner

WORKDIR /app

COPY --from=builder /app/build /usr/share/nginx/html

COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d

# EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]