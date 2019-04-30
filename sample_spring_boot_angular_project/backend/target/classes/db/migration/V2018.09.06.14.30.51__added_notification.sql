CREATE TABLE IF NOT EXISTS notification
(
  id bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
  event_date timestamp NOT NULL,
  receiver bigint NOT NULL,
  title varchar(100) NOT NULL,
  message varchar(255),
  hidden bit(1) DEFAULT FALSE NOT NULL,
  deleted bit(1) DEFAULT FALSE NOT NULL,
  CONSTRAINT notification_users_id_fk FOREIGN KEY (receiver) REFERENCES users (id)
);