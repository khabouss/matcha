import express from 'express';
import attachAuthRoute from './Modules/Auth/Routes/Auth.route';
import attachProfileRoute from './Modules/Auth/Routes/Profile.route';
import webPush from 'web-push';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});

const authRouter = express.Router();
const profileRouter = express.Router();

/** AUTH */
attachAuthRoute(authRouter);
/** PROFILE */
attachProfileRoute(profileRouter);

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use

export default app;
