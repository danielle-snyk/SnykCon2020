FROM alpine:3.7

RUN apk add --no-cache bash sudo nano sudo zip bzip2 fontconfig wget curl

RUN npm i form-data-to-object

COPY requirements.txt /app/

