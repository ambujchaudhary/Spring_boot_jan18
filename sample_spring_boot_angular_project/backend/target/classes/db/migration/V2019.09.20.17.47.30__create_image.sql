create table if not exists image
(
    id             bigint auto_increment    primary key,
    url            varchar(255) null,
    original_name  varchar(255) null,
    full_name      varchar(255) null,
    size_200       varchar(255) null,
    logo           varchar(255) null,
    users          bigint       null,
    constraint fk_prof_image_user
    foreign key (users) references users (id)
        on delete cascade
);

alter table profile drop column profile_photo;
