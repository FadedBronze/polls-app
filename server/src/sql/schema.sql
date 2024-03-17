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
  voted_polls INT[],
  created DATE NOT NULL
);

CREATE TABLE polls (
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  id SERIAL PRIMARY KEY,
  background VARCHAR(255) NOT NULL, 
  title_size REAL NOT NULL,
  title VARCHAR(255) NOT NULL,
  font_size REAL NOT NULL,
  font VARCHAR(255) NOT NULL,
  created DATE
);

CREATE TABLE choices (
  votes int NOT NULL,
  color VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  poll_id INT REFERENCES polls(id) ON DELETE CASCADE
);