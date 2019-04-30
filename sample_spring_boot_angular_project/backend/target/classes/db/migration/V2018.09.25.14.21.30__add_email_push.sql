alter table settings
    add column email bit not null default true,
    add column push  bit not null default true;