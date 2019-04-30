create table if not exists job_applicant
(
    id           bigint     auto_increment primary key,
    job          bigint     not null,
    applicant    bigint     not null,
    date         timestamp  not null,
    marker       bit        not null,
    constraint fk_job_applicant_job
    foreign key (job) references job (id),
    constraint fk_job_applicant_applicant
    foreign key (applicant) references users (id)
)