import { getRepository } from 'typeorm';
import { User } from '../database/entity/User';

const createUserController = () => {

	const createUser = (req, res) => {
		console.log('Verb: Post -- Path: /users');
		const {
			name,
			email,
			password
		} = req.body;

		const userRepository = getRepository(User);
		const user = userRepository.create({
			name,
			email,
			password
		});

		userRepository.save(user)
			.then(async (result) => {
				res.json({ user: result });
			})
			.catch(err => {
				console.log(`[Database] - Error: ${err}`);
				res.status(500).json({ message: 'Ops! Internal error' });
			});
	}

	return {
		createUser
	}
}

export default createUserController;