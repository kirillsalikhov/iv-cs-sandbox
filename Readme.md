## Setup

1. Copy integration/compose/sample.env to .env and fill vars
2. Run integration/bin/setup.sh

### Setup for Conversion service

```
integration/bin/setup_cs.sh
```
## Run

Inside /integration folder
backend + frontend
```
bin/main.sh up
```
backend + frontend + conversion service
```
bin/main.sh --mod=c up
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
