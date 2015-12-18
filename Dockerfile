FROM golang:latest

MAINTAINER max@wayt.me

RUN apt-get update -qq && \
    apt-get install -qqy npm ruby-sass
RUN ln -s /usr/bin/nodejs /usr/bin/node

ADD . /go/src/github.com/byttl/byt/
WORKDIR /go/src/github.com/byttl/byt/

RUN npm install && \
    npm install -g grunt-cli
RUN grunt

RUN go get
RUN go build

CMD ["/go/src/github.com/byttl/byt/byt"]

