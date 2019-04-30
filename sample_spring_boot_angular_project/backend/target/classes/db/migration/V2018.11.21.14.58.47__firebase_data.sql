CREATE TABLE if not exists firebase_data
(
  id    bigint PRIMARY KEY AUTO_INCREMENT,
  user  bigint,
  token VARCHAR(255),
  CONSTRAINT firebase_data_users_id_fk FOREIGN KEY (user) REFERENCES users (id)
);