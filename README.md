# Byt
Byt is file sharing service made easy

Public platform: https://wayt.ovh

## Run your own with Docker

```
docker run --name byt --restart=always -p 80:8080 maxwayt/byt:latest
```

You can also specify a data directory

```
docker run --name byt --restart=always -p 80:8080 -v /local/data:/data maxwayt/byt:latest
```

## Development

Configure your env

```
cp .env.example .env
vim .env
```

Make sure your `UPLOAD_DIR` exist and is read/write-able

Install npm dependencies

```
npm install
```

Minify web js/css

```
npm install -g grunt-cli
grunt
```

Run Golang web server

```
go run app.go
```
