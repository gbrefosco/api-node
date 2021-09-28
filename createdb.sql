create table customer (
	id SERIAL,
	name varchar(40),
	primary key (id)
);

create table account (
	id SERIAL,
	customer integer not null,
	balance bigint not null default 0,
	primary key (id),
	constraint fk_customer
		foreign key (customer)
	  	references customer(id)
);

create table transaction (
	id SERIAL,
	originAccount integer,
	destinyAccount integer not null,
	value bigint,
	primary key (id),
	constraint fk_account
		foreign key (originAccoount)
	  	references account(id),
	constraint fk_account_2
		foreign key (destinyAccount)
	  	references account(id)
);