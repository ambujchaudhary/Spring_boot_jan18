create table if not exists offer
(
    id        bigint auto_increment    primary key,
    job       bigint null,
    shooter   bigint null,
    date      date   null,
    accepted  bit    not null,
    constraint fk_offer_job
    foreign key (job) references job (id),
    constraint fk_offer_shooter
    foreign key (shooter) references users (id)
)