import { getRepository, Between, Not } from 'typeorm';
import { Event } from '../database/entity/Event';

const createEventController = () => {

	const createEvent = (req, res) => {
		console.log('Verb: Post -- Path: /events');
		const {
			description,
			startTime,
			endTime,
			ownerUser
		} = req.body;

		const eventRepository = getRepository(Event);

		checkPeriodAvailable(eventRepository, startTime, endTime, ownerUser)
			.then((available) => {
				if (available) {
					const event = eventRepository.create({
						description,
						startTime,
						endTime,
						ownerUser
					});

					eventRepository.save(event)
						.then((result) => {
							console.log('[Database] - New event saved');
							res.json({ event: { id: result.id, description: result.description, startTime: result.startTime, endTime: result.endTime } });
						})
						.catch(err => {
							console.log(`[Database] - Error: ${err}`);
							res.status(500).json({ message: 'Ops! Internal error' });
						});
				} else {
					res.status(500).json({ message: 'Ops! There is an event at this time' });
				}
			})
			.catch(err => {
				console.log(`[Database] - Error: ${err}`);
				res.status(500).json({ message: 'Ops! Internal error' });
			})

	}

	const deleteEvent = (req, res) => {
		console.log('Verb: Delete -- Path: /events');
		const eventId = parseInt(req.params.id);
		const ownerUser = parseInt(req.body.ownerUser);

		const eventRepository = getRepository(Event);

		eventRepository.update({ id: eventId, ownerUser: ownerUser }, { isActive: false })
			.then((result) => {
				if (result) {
					res.json({ message: 'Event deleted' });
				} else {
					res.status(404).json({ message: 'Event not found' });
				}
			}).catch((err) => {
				console.log(`[Database] - ${err}`);
				res.status(500).json({ message: 'Ops! Internal error' });
			})
	}

	const updateEvent = (req, res) => {
		console.log('Verb: Put -- Path: /events');
		const eventId = parseInt(req.params.id);
		const {
			description,
			startTime,
			endTime,
			ownerUser
		} = req.body;

		const eventRepository = getRepository(Event);

		checkPeriodAvailable(eventRepository, startTime, endTime, ownerUser, eventId)
			.then((available) => {
				if (available) {
					eventRepository.update({ id: eventId, ownerUser: ownerUser, isActive: true }, { description, startTime, endTime })
						.then((result) => {
							console.log(result)
							if (result) {
								res.json({ event: { description, startTime, endTime }, message: 'Event updated' });
							} else {
								res.status(404).json({ message: 'Event not found' });
							}
						}).catch((err) => {
							console.log(`[Database] - ${err}`);
							res.status(500).json({ message: 'Ops! Internal error' });
						})
				} else {
					res.status(500).json({ message: 'Ops! There is an event at this time' });
				}
			})
			.catch(err => {
				console.log(`[Database] - Error: ${err}`);
				res.status(500).json({ message: 'Ops! Internal error' });
			})
	}

	const checkPeriodAvailable = (eventRepository, startTime, endTime, ownerUser, id = null) => {
		return new Promise((resolve, reject) => {
			eventRepository.find({
				where: {
					ownerUser: ownerUser,
					startTime: Between(startTime, endTime),
					endTime: Between(startTime, endTime),
					isActive: true,
					id: Not(id)
				}
			})
				.then((result) => {
					if (result.length) {
						resolve(false);
					} else {
						resolve(true);
					}
				})
				.catch((err) => {
					console.log(`[Database] - ${err}`);
					reject(false);
				});
		})
	}


	return {
		createEvent,
		deleteEvent,
		updateEvent
	}
}

export default createEventController;