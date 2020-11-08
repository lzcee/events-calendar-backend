import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Event {

	@PrimaryGeneratedColumn()
	id = undefined;

	@Column('text')
	description = "";
 
	@Column('int')
	startTime = undefined;

	@Column('int')
	endTime = undefined;

	@Column('boolean')
	isActive = true;

	@ManyToOne(() => User, user => user.events)
	ownerUser = undefined;

}