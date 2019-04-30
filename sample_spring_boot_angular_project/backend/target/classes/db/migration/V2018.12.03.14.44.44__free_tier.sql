CREATE TABLE if not exists free_tier
(
  id           bigint PRIMARY KEY AUTO_INCREMENT,
  applications int DEFAULT 3 NOT NULL,
  jobs         int DEFAULT 1 NOT NULL,
  user        bigint,
  CONSTRAINT free_tier_users_id_fk FOREIGN KEY (user) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);