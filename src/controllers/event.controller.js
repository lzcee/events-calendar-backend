import { getRepository, Between } from 'typeorm';
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
							res.json({ event: { id: result.id } });
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

	const checkPeriodAvailable = (eventRepository, startTime, endTime, ownerUser) => {
		return new Promise((resolve, reject) => {
			eventRepository.find({
				where: {
					ownerUser: ownerUser,
					startTime: Between(startTime, endTime),
					endTime: Between(startTime, endTime)
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
		createEvent
	}
}

export default createEventController;