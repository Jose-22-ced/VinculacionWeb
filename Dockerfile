FROM node:10-alpine as build-step

RUN nmkdir -p /app

WORkDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build --prod

#Segunda etapa

FROM nginx:1.17.1-alpine

COPY --from=build-step /app/dist/vinculacion-web /usr/share/nginx/html
