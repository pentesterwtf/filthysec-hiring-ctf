FROM rustlang/rust:nightly-slim as builder
WORKDIR /usr/src/myapp
COPY . .
RUN cargo install --path .

FROM debian:buster-slim
# We don't have any dependancies with our binary
# But, in case we did - uncomment the following and replace it
# extra-runtime-dependencies is not a real package :)
#RUN apt-get update && apt-get install -y extra-runtime-dependencies && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/webapp /usr/local/bin/webapp
COPY --from=builder /usr/src/myapp/static /usr/src/myapp/static/
COPY --from=builder /usr/src/myapp/templates /usr/src/myapp/templates/
WORKDIR /usr/src/myapp
ENTRYPOINT ["webapp"]