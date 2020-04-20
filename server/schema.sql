
CREATE TABLE IF NOT EXISTS accounts (
  uid VARCHAR(36) PRIMARY KEY,
  created_at BIGINT UNSIGNED,
  email VARCHAR(100),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  photo TEXT(1000)
);

CREATE TABLE IF NOT EXISTS classes (
  uid VARCHAR(15) PRIMARY KEY,
  created_at BIGINT UNSIGNED,
  owner_uid VARCHAR(36),
  name VARCHAR(50),
  INDEX(owner_uid)
);

CREATE TABLE IF NOT EXISTS lectures (
  uid VARCHAR(15) PRIMARY KEY,
  created_at BIGINT UNSIGNED,
  class_uid VARCHAR(15),
  name VARCHAR(50),
  start_time BIGINT UNSIGNED,
  end_time BIGINT UNSIGNED,
  INDEX(class_uid)
);

CREATE TABLE IF NOT EXISTS lecture_log (
  db_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, 
  lecture_uid VARCHAR(10),
  time BIGINT UNSIGNED,
  account_uid VARCHAR(36),
  value SMALLINT,
  INDEX(lecture_uid),
  INDEX(account_uid)
);
