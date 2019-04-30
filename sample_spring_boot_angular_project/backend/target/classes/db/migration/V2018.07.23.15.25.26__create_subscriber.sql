create table if not exists subscriber
(
  id                  bigint auto_increment primary key,
  name                varchar(255)   not null,
  email               varchar(254)   not null,
  country             char(2)    not null,
  date                date           null,
  constraint email
  unique (email)
)