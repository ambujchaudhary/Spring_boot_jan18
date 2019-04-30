create table if not exists edited_profile
(
  id            bigint auto_increment
    primary key,
  experience     varchar(15)    not null,
  latitude       decimal(10, 8) not null,
  longitude      decimal(11, 8) not null,
  address        varchar(255)   not null,
  profile_photo  varchar(255)   not null,
  certificate    varchar(255)   null,
  public_bio     text           not null,
  admins_comment varchar(255)   null,
  users          bigint         not null,
  constraint fk_edited_profile_user
  foreign key (users) references users (id)
)
engine = InnoDB;

create table if not exists edited_profile_worker_roles
(
  edited_profile_id  bigint       null,
  worker_roles varchar(255) null
)
engine = InnoDB;

create table if not exists users_edited_equipment
(
  edited_profile_id   bigint       null,
  equipment varchar(255) null
)
  engine = InnoDB;

create table if not exists users_edited_images
(
  edited_profile_id bigint       null,
  images  varchar(255) null
)
  engine = InnoDB;

create table if not exists users_edited_resources
(
  edited_profile_id   bigint       null,
  resources varchar(255) null
)
  engine = InnoDB;

create table if not exists users_edited_videos
(
  edited_profile_id bigint       null,
  videos  varchar(255) null
)
  engine = InnoDB;

alter table profile drop column admins_comment;