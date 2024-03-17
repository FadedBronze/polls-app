# Polls App

This project was created using React, PostgreSQL, Kysely & Express. It supports:
- Basic authentication and login
- Ability to vote
- A poll editor

It does not support:
- email verification
- rate limiting

## Run it:

Login to your Postgres Shell:

```shell
psql -U <user-name>
```

In the shell create a Database:
```sql
CREATE DATABASE polls_db;
```

Install:
```shell
npm i
```

Run database setup:
```shell
cd server
npm run setup
```

Run server and client separately:
```shell
npm run dev
```

## License

Copyright 2024 Samyat Gautam

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.