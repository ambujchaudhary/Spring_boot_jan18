create table if not exists feedback
(
    id          bigint     auto_increment  primary key,
    star        varchar(5) not null,
    review      text       not null,
    job         bigint     not null,
    author      bigint     not null,
    receiver    bigint     not null,
    constraint fk_feedback_job
    foreign key (job) references job (id),
    constraint fk_feedback_author
    foreign key (author) references users (id),
    constraint fk_feedback_receiver
    foreign key (receiver) references users (id)
)