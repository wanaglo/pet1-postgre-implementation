import { pool } from '../databases/postgre';

class UserRepository {
    async findUserByEmail(email: string) {
        return await pool.query('SELECT * FROM users WHERE email = $1', [
            email,
        ]);
    }

    async findUserById(id: number) {
        return await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    }

    async findUsers() {
        return await pool.query('SELECT * FROM users');
    }

    async createUser(email: string, passHash: string) {
        return await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
            [email, passHash]
        );
    }
}

export default new UserRepository();
