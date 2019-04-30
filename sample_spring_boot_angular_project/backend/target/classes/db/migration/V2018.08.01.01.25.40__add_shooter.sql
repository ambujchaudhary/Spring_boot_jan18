alter table job
    add column shooter bigint,
    add constraint fk_job_shooter
    foreign key (shooter) references users (id);