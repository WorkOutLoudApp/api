FROM public.ecr.aws/bitnami/node:16.19.0
WORKDIR /srv/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
ENV NODE_ENV production
CMD ["node", "build/index.js"]
