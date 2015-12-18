# Byt
Byt is file sharing service made easy

Public platform: http://byt.tl

## Run your own with Docker

```
docker run --name byt --restart=always -p 80:8080 maxwayt/byt:latest
```

You can also specify a data directory

```
docker run --name byt --restart=always -p 80:8080 -v /local/data:/data maxwayt/byt:latest
```
