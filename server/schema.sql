
CREATE TABLE IF NOT EXISTS accounts (
  uid VARCHAR(36) PRIMARY KEY,
  created_at BIGINT UNSIGNED,
  email VARCHAR(100),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  photo TEXT(1000)
);

CREATE TABLE IF NOT EXISTS classes (
  uid VARCHAR(20) PRIMARY KEY,
  created_at BIGINT UNSIGNED,
  owner_uid VARCHAR(36),
  name VARCHAR(50),
  INDEX(owner_uid)
);

CREATE TABLE IF NOT EXISTS lectures (
  uid VARCHAR(20) PRIMARY KEY,
  created_at BIGINT UNSIGNED,
  class_uid VARCHAR(15),
  name VARCHAR(50),
  start_time BIGINT UNSIGNED,
  end_time BIGINT UNSIGNED,
  INDEX(class_uid)
);

CREATE TABLE IF NOT EXISTS lecture_log (
  lecture_uid VARCHAR(20),
  account_uid VARCHAR(36),
  elapsed BIGINT UNSIGNED,
  score SMALLINT,
  CONSTRAINT PRIMARY KEY (lecture_uid, account_uid, elapsed)
);

CREATE TABLE IF NOT EXISTS lecture_qs (
  lecture_uid VARCHAR(20),
  account_uid VARCHAR(36),
  elapsed BIGINT UNSIGNED,
  question TINYTEXT,
  CONSTRAINT PRIMARY KEY (lecture_uid, account_uid, elapsed)
);

CREATE TABLE IF NOT EXISTS lecture_us (
  lecture_uid VARCHAR(20),
  elapsed BIGINT UNSIGNED,
  score SMALLINT,
  CONSTRAINT PRIMARY KEY (lecture_uid, elapsed) 
);

CREATE TABLE IF NOT EXISTS feedback (
  account_uid VARCHAR(36),
  ts BIGINT UNSIGNED,
  stars TINYINT UNSIGNED,
  comments TEXT,
  tech_comments TEXT,
  diff_stars TINYINT UNSIGNED,
  helpful_stars TINYINT UNSIGNED,
  CONSTRAINT PRIMARY KEY (account_uid, ts)
);
