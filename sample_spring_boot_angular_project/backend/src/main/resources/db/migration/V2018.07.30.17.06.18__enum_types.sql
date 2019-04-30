alter table chargebee_data
    modify column card_type varchar(10),
    modify column currency_code varchar(3);

alter table profile
    modify column experience varchar(12) not null;

alter table job
    modify column owner_type varchar(13) not null,
    modify column job_status varchar(20);

alter table subscription
    modify column subscription_status varchar(12);

alter table temporal_links
    modify column type varchar(28);

alter table users
    modify column role varchar(14) not null,
    modify column status varchar(20);
