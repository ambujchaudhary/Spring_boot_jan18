rename table user_profile_user_profile_roles to user_profile_worker_roles;

alter table user_profile_worker_roles change column user_profile_roles worker_roles varchar(255);

create table if not exists job
(
  id                  bigint auto_increment primary key,
  job_owner           varchar(255)   not null,
  job_title           varchar(255)   not null,
  job_date            date           not null,
  latitude            decimal(10, 8) not null,
  longitude           decimal(11, 8) not null,
  address             varchar(255)   not null,
  brief               text           null,
  price_per_hour      decimal(8, 2)  not null,
  number_of_hour      decimal(4, 2)  not null,
  contract            varchar(255)   null,
  quick_summary       text           not null,
  payment_details     text           not null,
  users               bigint         not null,
  constraint fk_job_user
  foreign key (users) references users (id)
)
  engine = InnoDB;

create table if not exists job_worker_roles
(
  job_id bigint       null,
  worker_roles varchar(255) null
)
  engine = InnoDB;

create table if not exists job_equipment
(
  job_id bigint       null,
  equipment  varchar(255) null
)
  engine = InnoDB;

create table if not exists job_attachment
(
  job_id bigint       null,
  attachment varchar(255) null
)
  engine = InnoDB;
