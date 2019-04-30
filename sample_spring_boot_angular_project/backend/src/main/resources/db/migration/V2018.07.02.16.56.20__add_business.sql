alter table profile drop column business_name;

create table if not exists business_profile
(
  id                    bigint auto_increment
    primary key,
  business_name         varchar(255)   not null,
  abn                   varchar(100)   not null,
  gst                   bit            not null,
  latitude              decimal(10, 8) not null,
  longitude             decimal(11, 8) not null,
  address               varchar(255)   not null,
  web_address           varchar(255)   not null,
  users                 bigint         null,
  constraint fk_business_profile_user
  foreign key (users) references users (id)
)
  engine = InnoDB;