# docker build -t sjtucaocao/mini-mqtt-robot:1.0 -f mini-mqtt/robot.Dockerfile .

FROM denoland/deno:latest

WORKDIR /
RUN mkdir /demo

COPY . /demo

WORKDIR /demo/mini-mqtt

EXPOSE 7878
ENTRYPOINT ["deno", "run", "--allow-net", "robot.ts"]
