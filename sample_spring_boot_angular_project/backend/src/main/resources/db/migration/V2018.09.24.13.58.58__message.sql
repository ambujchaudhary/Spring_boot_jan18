CREATE TABLE IF NOT EXISTS message
(
  id bigint PRIMARY KEY AUTO_INCREMENT,
  job bigint,
  message text,
  chat_id varchar(120),
  sender bigint,
  recipient bigint,
  message_status varchar(15),
  created_at timestamp null,
  modified_at timestamp null,
  CONSTRAINT message_job_id_fk FOREIGN KEY (job) REFERENCES job (id),
  CONSTRAINT message_users_id_fk FOREIGN KEY (sender) REFERENCES users (id),
  CONSTRAINT message_users_id_fk_2 FOREIGN KEY (recipient) REFERENCES users (id)
);