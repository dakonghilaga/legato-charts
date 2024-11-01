# Legato Charts
### Project monorepo for building products and services from music data.

### Development Prerequisites

* Code editor of choice
* Docker https://www.docker.com/
* PNPm https://pnpm.io/
* Node.js https://nodejs.org/en

### Install dependencies

```bash
pnpm i
```

### Setup Husky Git hooks

```bash
pnpm run prepare
```

### Start the project

```bash
pnpm run start
```

### Import Sample Data
```curl
curl --location 'http://localhost:3001/tracks/import/csv' \
--form 'file=@"/project-root/seed/sample-data.csv"'
```

## Structure
```text
project-root/
├─ .husky/                # Husky Git hooks configs
├─ bin/                   # Project startup scripts
├─ packages/              # Monorepo shared packages
├─ projects/              # Directory containing individual applications
   ├─ api/                # API: See ./projects/api/README.md
├─ seed/                  # Directory containing sample data
├─ .dockerignore          # Files and directories ignored by Docker
├─ .gitignore             # Files and directories ignored by Git
├─ docker-compose.yaml    # Multi-container apps to run the project for local development
├─ pnpm-lock.yaml         # Project dependencies lock file
├─ pnpm-workspace.yaml    # Workspace config uniting all components for the project
├─ README.md              # This file
├─ turbo.json             # Turbo repo config / pipeline
```