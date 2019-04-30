create table if not exists settings
(
    id             bigint   auto_increment primary key,
    radius         int      not null,
    users          bigint   null,
    constraint fk_settings_user
    foreign key (users) references users (id)
        on delete cascade
);