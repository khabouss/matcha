import { Router } from 'express';
const { PrismaClient } = require('@prisma/client');
import bcrypt from 'bcryptjs';
import { log } from 'console';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const attachAuthRoute = (router: Router) => {
    router.post('/login', (req, res) => {
        res.send('Login page');
    });

    router.post('/register', async (req, res) => {
        const { email, password, userName, firstName, lastName } = req.body;
        console.log(email, password, name);

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    userName,
                    firstName,
                    lastName,
                },
            });
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN,
            });
            // res.status(201).json(user);
            res.status(201).json({
                status: 'success',
                token,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    },
                },
            });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    });
    router.post('/sign-in', async (req, res) => {
        const { username, password } = req.body;

        // try {
        if (username === 'user1') {
            res.status(200).json({
                status: 'success',

                data: {
                    status: 'success',
                    id: 1,
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImVtYWlsIjoidXNlcjI1NEBleGFtcGxlLmNvbSIsIm5hbWUiOiJBbGljZSIsImlhdCI6MTcyODgzODgyMCwiZXhwIjoxNzI4ODQyNDIwfQ.cpbK1GNiv01AZxCOaogrQ_GzACwovVZM-nPwo_tLcVI',
                },
            });
        } else {
            res.status(404).json({
                status: 'error',
                error_message: 'User not found',
            });
        }
    });

    router.post('/sign-up', (req, res) => {
        const { username, password, firstName, lastName, email } = req.body;
        if (username === 'user1') {
            res.status(201).json({
                status: 'success',
            });
            // sendVerificationEmail(email); // (TODO)
        } else {
            res.status(409).json({
                status: 'error',
                error_message: 'Email already exists',
            });
        }
    });
    router.post('/reset-password', (req, res) => {
        const { email } = req.body;
        if (email === 'user1@gmail.com') {
            res.status(200).json({
                status: 'success',
            });
            // sendResetPasswordEmail(email); // (TODO)
        } else {
            res.status(404).json({
                status: 'error',
                error_message: 'User not found',
            });
        }
    });
    router.post('/new-password', (req, res) => {
        const { token, newPassword } = req.body;
        if (token === 'token') {
            res.status(200).json({
                status: 'success',
                data: {
                    status: 'success',
                    id: 1,
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImVtYWlsIjoidXNlcjI1NEBleGFtcGxlLmNvbSIsIm5hbWUiOiJBbGljZSIsImlhdCI6MTcyODgzODgyMCwiZXhwIjoxNzI4ODQyNDIwfQ.cpbK1GNiv01AZxCOaogrQ_GzACwovVZM-nPwo_tLcVI',
                },
            });
        } else {
            res.status(404).json({
                status: 'error',
                error_message: 'Token not found',
            });
        }
    });
};

export default attachAuthRoute;
