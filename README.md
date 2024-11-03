# Legato Charts
### Project monorepo for building products and services from music data.

##  1. Development
### 1.1 Development Prerequisites

* Code editor of choice
* Docker https://www.docker.com/
* PNPm https://pnpm.io/
* Node.js https://nodejs.org/en

### 1.2 Install Dependencies

```bash
pnpm i
```

### 1.3 Setup Husky Git Hooks

```bash
pnpm run prepare
```

### 1.4 Start the Project

```bash
pnpm run start
```

### 1.5 Import Sample Data
```curl
# example 

curl --location 'http://localhost:3001/tracks/import/csv' \
--form 'file=@"/project-root/seed/sample-data.csv"'
```

## 2. Structure
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

## 3. Technologies
* Node.js https://nodejs.org/en
* Koa: https://koajs.com/
* MongoDB: https://www.mongodb.com/
* Redis: https://redis.io/
* TypeScript: https://www.typescriptlang.org/
* Docker: https://www.docker.com/
* Turbo Repo: https://turbo.build/repo/docs

## 4. Contributing
* For the meantime, please search and check all `TODO`.