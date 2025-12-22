CREATE TABLE challenges (
  id                    INT PRIMARY KEY AUTO_INCREMENT,
  theme_title           VARCHAR(255) NOT NULL,
  theme_description     VARCHAR(255) NOT NULL,
  required_picture_url  VARCHAR(255) NOT NULL,
  start_date            DATETIME NOT NULL,
  end_date              DATETIME NOT NULL,
  is_archived           BOOLEAN
);

CREATE TABLE users (
  id               INT PRIMARY KEY AUTO_INCREMENT,
  email            VARCHAR(255) NOT NULL UNIQUE,
  password         VARCHAR(255) NOT NULL,
  last_name        VARCHAR(255) NOT NULL,
  first_name       VARCHAR(255) NOT NULL,
  is_admin         BOOLEAN ,
  inscription_date DATETIME NOT NULL
);

CREATE TABLE entries (
  id                 INT PRIMARY KEY AUTO_INCREMENT,
  challenge_id       INT REFERENCES challenges(id) ON DELETE CASCADE,
  user_id            INT REFERENCES users(id) ON DELETE CASCADE,
  edited_picture_url VARCHAR(255) NOT NULL,
  submit_date        DATETIME NOT NULL,
  is_hidden          BOOLEAN
);

CREATE TABLE comments (
  id                INT PRIMARY KEY AUTO_INCREMENT,
  entry_id          INT REFERENCES entries(id) ON DELETE CASCADE,
  user_id           INT REFERENCES users(id) ON DELETE CASCADE,
  content           VARCHAR(255) NOT NULL,
  date              DATETIME NOT NULL
);

CREATE TABLE vote (
  id                   INT PRIMARY KEY AUTO_INCREMENT,
  user_id              INT REFERENCES users(id) ON DELETE CASCADE,
  entry_id             INT REFERENCES entries(id) ON DELETE CASCADE,
  creativity_rating    FLOAT NOT NULL,
  technical_rating     FLOAT NOT NULL,
  theme_respect_rating FLOAT NOT NULL,
  vote_date            DATETIME,

  UNIQUE(user_id, entry_id)
);