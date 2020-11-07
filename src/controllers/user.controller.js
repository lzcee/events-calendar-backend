import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';

import createAuth from '../services/auth.service';

import { User } from '../database/entity/User';

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
					encryptPassword(password)
						.then(encryptedPassword => {
							const user = userRepository.create({
								name: name,
								email: email,
								password: encryptedPassword
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
						})
						.catch(err => {

						})

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
		const {
			email,
			password
		} = req.body;

		const userRepository = getRepository(User);

		userRepository.findOne({
			where: { email: email }
		})
			.then((result) => {
				if (result) {
					checkPassword(password, result.password)
						.then(async (check) => {
							if (check) {
								const token = await auth.genereteToken({
									name: result.name,
									email: result.email,
									password: result.password
								});
								res.json({ user: { id: result.id, name: result.name }, token });
							}
							else {
								res.status(404).json({ message: 'Ops! Incorrect Fields' });
							}
						})
						.catch( err => {
							console.log(`[Password] - ${err}`);
							res.status(500).json({ message: 'Ops! Internal error' });
						});

				} else {
					res.status(404).json({ message: 'Ops! User not found' });
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

	const encryptPassword = (password) => {
		return new Promise((resolve, reject) => {
			bcrypt
				.genSalt(10)
				.then((salt) => {
					return bcrypt.hash(password, salt);
				})
				.then((hash) => {
					resolve(hash);
				})
				.catch((err) => {
					console.log(`[Encrypt] - ${err}`);
					reject(err);
				});
		})
	}

	const checkPassword = (password, encryptedPassword) => {
		return new Promise((resolve, reject) => {
			bcrypt
				.compare(password, encryptedPassword)
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					console.log(`[Password] - ${err}`);
					reject(err);
				});
		})
	}

	return {
		createUser,
		findUser
	}
}

export default createUserController;