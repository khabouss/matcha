import { Router } from 'express';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const attachAuthRoute = (router: Router) => {
    router.post('/login', (req, res) => {
        res.send('Login page');
    });

    router.post('/register', (req, res) => {
        res.send('Register page');
    });
    router.post('/users', async (req, res) => {
        const { name, email } = req.body;
        const user = await prisma.user.create({
            data: { name, email },
        });
        res.json(user);
    });
    router.get('/users', async (req, res) => {
        const users = await prisma.user.findMany();
        res.json(users);
    });
};

export default attachAuthRoute;
