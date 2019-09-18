FROM zokrates/zokrates:0.4.11 as builder
ARG NPM_TOKEN

FROM node:11.15
ARG NPM_TOKEN
WORKDIR /app
COPY --from=builder /home/zokrates/zokrates /app/zokrates
COPY --from=builder /home/zokrates/.zokrates* /app/stdlib
COPY ./package.json ./package-lock.json ./.npmrc ./
RUN npm ci
RUN rm .npmrc
EXPOSE 80
CMD npm start
