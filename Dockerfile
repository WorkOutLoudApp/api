FROM public.ecr.aws/bitnami/node:16.19.0
WORKDIR /srv/app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
ENV NODE_ENV production
ENV PORT 3000
CMD ["node", "dist/server.js"]
