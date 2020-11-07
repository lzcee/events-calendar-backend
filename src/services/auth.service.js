import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const createAuth = () => {
	
	dotenv.config();
	const saltkey = process.env.SALT_KEY;

	async function genereteToken(data) {
		return jwt.sign(data, saltkey, { expiresIn: '1d' });
	}

	async function decodeToken(token) {
		let data = await jwt.verify(token, saltkey);
		return data;
	}

	const authorize = (req, res, next) => {
		let token = req.body.token || req.query.token || req.headers['x-access-token'];

		if (!token) {
			res.status(401).json({ message: 'Restric access' });
		} else {
			jwt.verify(token, saltkey, (error) => {
				if (error) {
					res.status(401).json({ message: 'Invalid token' });
				} else {
					next();
				}
			});
		}
	}

	return {
		genereteToken,
		decodeToken,
		authorize
	}
}

export default createAuth;