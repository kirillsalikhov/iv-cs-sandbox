## Setup

1. Rename integration/compose/sample.env to .env and fill vars
2. Run integration/bin/setup.sh

## Run

Inside integration folder
```
bin/main.sh up
```

## Dev

Inside integration folder

backend in dev mode

```
bin/main.sh --mod=b up
```
http://localhost:3050

frontend in dev mode
```
bin/main.sh --mod=f up
```

frontend,backend in dev mode
frontend in dev mode
```
bin/main.sh --mod=bf up
```
