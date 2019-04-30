create table if not exists UserConnection
(
  userId         varchar(255) not null,
  providerId     varchar(255) not null,
  providerUserId varchar(255) not null,
  rank           int          not null,
  displayName    varchar(255) null,
  profileUrl     varchar(512) null,
  imageUrl       varchar(512) null,
  accessToken    varchar(255) not null,
  secret         varchar(255) null,
  refreshToken   varchar(255) null,
  expireTime     bigint       null,
  primary key (userId, providerId, providerUserId),
  constraint UserConnectionRank
  unique (userId, providerId, rank)
)
  engine = InnoDB;

create table if not exists user_profile_user_profile_roles
(
  user_profile_id    bigint       null,
  user_profile_roles varchar(255) null
)
  engine = InnoDB;

create table if not exists users
(
  id                       bigint auto_increment
    primary key,
  first_name               varchar(40)    not null,
  last_name                varchar(40)    not null,
  email                    varchar(254)   not null,
  user_password            varchar(60)    not null,
  start_date               date           null,
  role                     varchar(30)    not null,
  address                  varchar(255)   null,
  mobile_phone             varchar(18)    null,
  latitude                 decimal(10, 8) null,
  longitude                decimal(11, 8) null,
  status                   varchar(25)    null,
  social_id                varchar(25)    null,
  constraint email
  unique (email)
)
  engine = InnoDB;

create table if not exists profile
(
  id            bigint auto_increment
    primary key,
  experience     varchar(15)    not null,
  latitude       decimal(10, 8) not null,
  longitude      decimal(11, 8) not null,
  address        varchar(255)   not null,
  business_name  varchar(255)   null,
  profile_photo  varchar(255)   not null,
  certificate    varchar(255)   null,
  public_bio     text           not null,
  admins_comment varchar(255)   null,
  users          bigint         not null,
  constraint fk_profile_user
  foreign key (users) references users (id)
)
  engine = InnoDB;

ALTER TABLE profile ADD INDEX fk_profile_user (users);

create table if not exists temporal_images
(
  id        bigint auto_increment
    primary key,
  image_url varchar(255) null,
  users     bigint       null,
  constraint fk_image_user
  foreign key (users) references users (id)
    on delete cascade
)
  engine = InnoDB;

ALTER TABLE temporal_images ADD INDEX fk_image_user (users);

create table if not exists temporal_links
(
  id          bigint auto_increment
    primary key,
  token       char(30)    null,
  type        varchar(30) null,
  active      bit         null,
  expiry_date date        null,
  users       bigint      null,
  constraint fk_token_user
  foreign key (users) references users (id)
    on delete cascade
)
  engine = InnoDB;

ALTER TABLE temporal_links ADD INDEX fk_token_user (users);

create table if not exists users_drones
(
  user_id bigint       null,
  drones  varchar(255) null
)
  engine = InnoDB;

create table if not exists users_equipment
(
  user_id   bigint       null,
  equipment varchar(255) null
)
  engine = InnoDB;

create table if not exists users_images
(
  user_id bigint       null,
  images  varchar(255) null
)
  engine = InnoDB;

create table if not exists users_resources
(
  user_id   bigint       null,
  resources varchar(255) null
)
  engine = InnoDB;

create table if not exists users_videos
(
  user_id bigint       null,
  videos  varchar(255) null
)
  engine = InnoDB;

create table if not exists chargebee_data
(
  id        bigint auto_increment
    primary key,
  customer_id varchar(255) null,
  card_gateway_account_id varchar(255) null,
  masked_card_number char(16) null,
  expiry_year char(4) null,
  expiry_month varchar(2) null,
  currency_code varchar(15) null,
  card_type varchar(15) null,
  users     bigint       null,
  constraint fk_chargebee_user
  foreign key (users) references users (id)
    on delete cascade
)
  engine = InnoDB;

ALTER TABLE chargebee_data ADD INDEX fk_chargebee_user (users);

create table if not exists subscription
(
  id        bigint auto_increment
    primary key,
  subscription_id varchar(255) null,
  date_to date null,
  description varchar(255) null,
  subscription_status varchar(15) null,
  users     bigint       null,
  constraint fk_subscription_user
  foreign key (users) references users (id)
    on delete cascade
)
  engine = InnoDB;

ALTER TABLE subscription ADD INDEX fk_subscription_user (users);

INSERT IGNORE INTO shootzu.users (id, first_name, last_name, email, user_password, start_date, role, address, mobile_phone, latitude, longitude, status) VALUES (1, 'admin', 'admin', 'admin@gmail.com', '$2a$10$CX3CNrjxuuHjavAjV0b1MO/uQyPBqpO3/iKisgV4RPgrOCaECDi/K', null, 'ROLE_ADMIN', null, null, null, null, 'NEW');
INSERT IGNORE INTO shootzu.users (id, first_name, last_name, email, user_password, start_date, role, address, mobile_phone, latitude, longitude, status) VALUES (2, 'user', 'user', 'user@gmail.com', '$2a$10$CX3CNrjxuuHjavAjV0b1MO/uQyPBqpO3/iKisgV4RPgrOCaECDi/K', null, 'ROLE_USER', null, null, null, null, 'NEW');
