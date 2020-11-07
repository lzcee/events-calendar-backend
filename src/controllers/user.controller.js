import { getRepository } from 'typeorm';
import { User } from '../database/entity/User';
import createAuth from '../services/auth.service';

const createUserController = () => {

	const auth = createAuth();

	const createUser = (req, res) => {
		console.log('Verb: Post -- Path: /users');
		const {
			name,
			email,
			password
		} = req.body;

		const userRepository = getRepository(User);

		checkUserExists(userRepository, email)
			.then((result) => {
				if (!result) {
					const user = userRepository.create({
						name,
						email,
						password
					});

					userRepository.save(user)
						.then(async (result) => {
							const token = await auth.genereteToken({
								name,
								email,
								password
							});

							console.log('[Database] - New user saved');
							res.json({ user: { id: result.id, name: result.name }, token });
						})
						.catch(err => {
							console.log(`[Database] - Error: ${err}`);
							res.status(500).json({ message: 'Ops! Internal error' });
						});
				} else {
					res.status(500).json({ message: 'Ops! User exists' });
				}
			})
			.catch(err => {
				console.log(`[Database] - Error: ${err}`);
				res.status(500).json({ message: 'Ops! Internal error' });
			})

	}

	const findUser = (req, res) => {
		console.log('Verb: Get -- Path: /users');
		let reqUserId = parseInt(req.params.id);

		const userRepository = getRepository(User);

		userRepository.findOne({
			id: reqUserId
		})
			.then(async (result) => {
				if (result) {
					const token = await auth.genereteToken({
						name: result.name,
						email: result.email,
						password: result.password
					});
					res.json({ user: { id: result.id, name: result.name }, token });
				} else {
					res.status(404).json({});
				}
			})
			.catch((err) => {
				console.log(`[Database] - ${err}`);
				res.status(500).json({ message: 'Ops! Internal error' });
			});
	}

	const checkUserExists = (userRepository, email) => {
		return new Promise((resolve, reject) => {
			userRepository.find({
				where: { email: email }
			})
				.then((result) => {
					if (result.length) {
						resolve(true);
					} else {
						resolve(false);
					}
				})
				.catch((err) => {
					console.log(`[Database] - ${err}`);
					reject(true);
				});
		})
	}

	return {
		createUser,
		findUser
	}
}

export default createUserController;