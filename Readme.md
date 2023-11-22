# Industrial viewer sandbox

## Setup

Inside folder frontend

Install packages
```
npm ci
```
## Run

Inside folder frontend

1. Run dev Vite dev server
   ```
   npm run dev
   ```
2. Open browser http://localhost:5173/


# Conversion Service + Industrial viewer sandbox

## Setup
1. Docker login
   ```
   docker login docker.webgears3d.com
   ```
   Note: if login successful cmd bellow should work
   ```
   integration/bin/main.sh --mod=c pull
   ```
2. Copy integration/compose/sample.env to .env and fill vars

   **Note**: change `__DEV_HOST_IP__` to you developer's host ip
3. Put license.lic file in integration/compose/
4. Run setup scripts
   ```
   integration/bin/setup.sh
   integration/bin/setup_cs.sh
   ```

## Run

```
integration/bin/main.sh --mod=c up
```
Open browser http://localhost:3050

### Dev modes

Frontend in dev mode
```
integration/bin/main.sh --mod=fc up
```

Backend in dev mode
```
integration/bin/main.sh --mod=bc up
```

Frontend & Backend in dev mode
```
integration/bin/main.sh --mod=fbc up
```

## Deploy

Sandbox
```
integration/deploy/sanbox.sh
```
Note: .env not copied, 
bin/setup.sh should be run on server manually 
