# export DOCKER_DEFAULT_PLATFORM=linux/amd64
# docker build -t sjtucaocao/mini-mqtt-agent:1.0 -f mini-mqtt/agent-2-0.Dockerfile .

FROM mtconnect/agent:2.4 AS mtconnect_agent

FROM ubuntu:24.04

WORKDIR /
RUN mkdir /agent
RUN mkdir /demo

COPY --from=mtconnect_agent /usr/bin/mtcagent /agent
COPY . /demo

WORKDIR /demo/mini-mqtt
RUN ["sed", "-i", "s/ Host = localhost/ Host = mtconnect-worker2/g", "agent-2-0.cfg"]
RUN ["sed", "-i", "s/MqttHost = localhost/MqttHost = mtconnect-worker/g", "agent-2-0.cfg"]

EXPOSE 8000
ENTRYPOINT ["/agent/mtcagent", "debug", "agent-2-0.cfg"]
