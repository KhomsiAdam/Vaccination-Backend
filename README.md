# Introduction:

Express Rest API boilerplate to kickstart a project with already setup structure, testing, auth and routing.

# Config:

Copy or rename `.env.example` into `.env`, and fill in the values:

```
# Database:
DB_CLUSTER=
DB_NAME=
DB_USER=
DB_PASS=

# Test Database
DB_CLUSTER_TEST=
DB_NAME_TEST=
DB_USER_TEST=
DB_PASS_TEST=

# Client Origin
CLIENT_ORIGIN=

# Server Port
PORT=

# API Access Secrets
ADMIN_ACCESS_SECRET=
USER_ACCESS_SECRET=

# API Refresh Secrets
ADMIN_REFRESH_SECRET=
USER_REFRESH_SECRET=

# Admin Credentials
ADMIN_EMAIL=
ADMIN_PASSWORD=

# NODE ENV
NODE_ENV=development
```

Install dependencies:

```
yarn
```

Seed Database with an Admin account:

```
yarn seed
```

Run tests (need a testing database):

```
yarn test
```

# Usage:

Run server in development mode:

```
yarn dev
```

Run server in development mode (detect use of sync APIs):

```
yarn dev:sync
```

Run server in production mode:

```
yarn start
```

# Api:

Current user data format (for login, register and update):

```json
{
    "email": "email@domain.com",
    "password": "password"
}
```

Register (POST): `/register`

Login (POST): `/login`
* Get an Access Token, Sets Refresh Token in cookie httpOnly.

Refresh Token (POST): `/refresh`
* Send Refresh Token from cookie to get new Access Token.

Logout (GET): `/logout`

Admin endpoints:

Users (GET): `/admin/users`\
User (GET): `/admin/user/:id`\
User (PATCH): `/admin/user/:id`\
User (DELETE): `/admin/user/:id`