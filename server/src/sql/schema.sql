CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  csrf_token VARCHAR(255) UNIQUE NOT NULL,
  session_code VARCHAR(255) UNIQUE NOT NULL,
  created DATE NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  session_id INT REFERENCES sessions(id),
  created DATE NOT NULL
);