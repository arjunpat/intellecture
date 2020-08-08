
CREATE TABLE IF NOT EXISTS accounts (
  uid VARCHAR(36) PRIMARY KEY,
  created_at BIGINT UNSIGNED,
  email VARCHAR(100),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  photo TEXT(1000),
  UNIQUE KEY (email)
);

CREATE TABLE IF NOT EXISTS classes (
  uid VARCHAR(20) PRIMARY KEY,
  created_at BIGINT UNSIGNED,
  account_uid VARCHAR(36),
  name VARCHAR(50),
  section VARCHAR(50),
  FOREIGN KEY (account_uid) REFERENCES accounts(uid) ON DELETE CASCADE -- creates index auto
);

CREATE TABLE IF NOT EXISTS lectures (
  uid VARCHAR(20) PRIMARY KEY,
  created_at BIGINT UNSIGNED,
  class_uid VARCHAR(15),
  name VARCHAR(50),
  start_time BIGINT UNSIGNED,
  end_time BIGINT UNSIGNED,
  scheduled_start BIGINT UNSIGNED,
  join_code VARCHAR(5),
  UNIQUE KEY (join_code),
  FOREIGN KEY (class_uid) REFERENCES classes(uid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feedback (
  account_uid VARCHAR(36),
  ts BIGINT UNSIGNED,
  stars TINYINT UNSIGNED,
  comments TEXT,
  tech_comments TEXT,
  diff_stars TINYINT UNSIGNED,
  helpful_stars TINYINT UNSIGNED,
  CONSTRAINT PRIMARY KEY (account_uid, ts),
  FOREIGN KEY (account_uid) REFERENCES accounts(uid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lecture_log (
  lecture_uid VARCHAR(20),
  account_uid VARCHAR(36),
  elapsed BIGINT UNSIGNED,
  score SMALLINT,
  CONSTRAINT PRIMARY KEY (lecture_uid, account_uid, elapsed),
  FOREIGN KEY (lecture_uid) REFERENCES lectures(uid) ON DELETE CASCADE,
  FOREIGN KEY (account_uid) REFERENCES accounts(uid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lecture_qs (
  uid VARCHAR(20) PRIMARY KEY,
  lecture_uid VARCHAR(20),
  account_uid VARCHAR(36),
  elapsed BIGINT UNSIGNED,
  dismissed BOOLEAN,
  question TINYTEXT,
  FOREIGN KEY (lecture_uid) REFERENCES lectures(uid) ON DELETE CASCADE,
  FOREIGN KEY (account_uid) REFERENCES accounts(uid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lecture_us (
  lecture_uid VARCHAR(20),
  elapsed BIGINT UNSIGNED,
  score SMALLINT,
  CONSTRAINT PRIMARY KEY (lecture_uid, elapsed),
  FOREIGN KEY (lecture_uid) REFERENCES lectures(uid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lecture_q_upvotes (
  question_uid VARCHAR(20),
  account_uid VARCHAR(36),
  elapsed BIGINT UNSIGNED,
  CONSTRAINT PRIMARY KEY (question_uid, account_uid),
  FOREIGN KEY (question_uid) REFERENCES lecture_qs(uid) ON DELETE CASCADE,
  FOREIGN KEY (account_uid) REFERENCES accounts(uid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lecture_student_log (
  lecture_uid VARCHAR(20),
  account_uid VARCHAR(36),
  elapsed BIGINT UNSIGNED,
  status VARCHAR(1), -- j for join, l for leave
  CONSTRAINT PRIMARY KEY (lecture_uid, account_uid, elapsed),
  FOREIGN KEY (lecture_uid) REFERENCES lectures(uid) ON DELETE CASCADE,
  FOREIGN KEY (account_uid) REFERENCES accounts(uid) ON DELETE CASCADE
);
