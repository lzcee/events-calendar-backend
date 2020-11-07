import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

	@PrimaryGeneratedColumn()
	id = undefined;

	@Column('text')
	name = "";

	@Column('text')
	email = "";

	@Column('text')
	password = "";

}