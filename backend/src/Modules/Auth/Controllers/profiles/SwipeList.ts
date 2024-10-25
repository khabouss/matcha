import { Request, Response, NextFunction } from 'express';

const swipeList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const swipeData = [
            {
                name: 'Alice',
                username: 'khabouss',
                isMatch: true,
                lastOnlineStatus: 'Two weeks ago',
                about: {
                    gender: 'Man',
                    SP: 'Straight',
                    interest1: 'Jogging',
                    interest2: 'Coffee',
                    intereset3: 'Movies',
                    fame: 'fame: 3.12',
                },
                languages: ['english', 'arabic', 'russian'],
                lastLocation: 'Marrakech',
                age: 25,
                bio: 'Love traveling and photography.',
                image: [
                    'https://picsum.photos/400/600?random=1',
                    'https://picsum.photos/400/600?random=1',
                    'https://picsum.photos/400/600?random=1',
                    'https://picsum.photos/400/600?random=1',
                    'https://picsum.photos/400/600?random=1',
                ],
                offsetX: 0,
                rotate: 0,
                opacity: 1,
            },
            {
                name: 'Bob',
                username: 'majdahim',
                isMatch: false,
                lastOnlineStatus: 'online',
                about: {
                    gender: 'Man',
                    SP: 'Straight',
                    interest1: 'Jogging',
                    interest2: 'Coffee',
                    intereset3: 'Movies',
                    fame: 'fame: 3.12',
                },
                languages: ['english', 'arabic', 'russian'],
                lastLocation: 'Marrakech',
                age: 30,
                bio: 'Avid hiker and coffee enthusiast.',
                image: [
                    'https://picsum.photos/400/600?random=2',
                    'https://picsum.photos/400/600?random=2',
                    'https://picsum.photos/400/600?random=2',
                    'https://picsum.photos/400/600?random=2',
                    'https://picsum.photos/400/600?random=2',
                ],
                offsetX: 0,
                rotate: 0,
                opacity: 1,
            },
            {
                name: 'Clara',
                isMatch: false,
                lastOnlineStatus: 'online',
                about: {
                    gender: 'Man',
                    SP: 'Straight',
                    interest1: 'Jogging',
                    interest2: 'Coffee',
                    intereset3: 'Movies',
                    fame: 'fame: 3.12',
                },
                languages: ['english', 'arabic', 'russian'],
                lastLocation: 'Marrakech',
                age: 28,
                bio: 'Book lover and food explorer.',
                image: [
                    'https://picsum.photos/400/600?random=3',
                    'https://picsum.photos/400/600?random=3',
                    'https://picsum.photos/400/600?random=3',
                    'https://picsum.photos/400/600?random=3',
                    'https://picsum.photos/400/600?random=3',
                ],
                offsetX: 0,
                rotate: 0,
                opacity: 1,
            },
            {
                name: 'Samuel',
                isMatch: false,
                lastOnlineStatus: 'online',
                about: {
                    gender: 'Man',
                    SP: 'Straight',
                    interest1: 'Jogging',
                    interest2: 'Coffee',
                    intereset3: 'Movies',
                    fame: 'fame: 3.12',
                },
                languages: ['english', 'arabic', 'russian'],
                lastLocation: 'Marrakech',
                age: 28,
                bio: 'Book lover and food explorer.',
                image: [
                    'https://picsum.photos/400/600?random=4',
                    'https://picsum.photos/400/600?random=4',
                    'https://picsum.photos/400/600?random=4',
                    'https://picsum.photos/400/600?random=4',
                    'https://picsum.photos/400/600?random=4',
                ],
                offsetX: 0,
                rotate: 0,
                opacity: 1,
            },
            {
                name: 'Jackson',
                isMatch: false,
                lastOnlineStatus: 'online',
                about: {
                    gender: 'Man',
                    SP: 'Straight',
                    interest1: 'Jogging',
                    interest2: 'Coffee',
                    intereset3: 'Movies',
                    fame: 'fame: 3.12',
                },
                languages: ['english', 'arabic', 'russian'],
                lastLocation: 'Marrakech',
                age: 28,
                bio: 'Book lover and food explorer.',
                image: [
                    'https://picsum.photos/400/600?random=5',
                    'https://picsum.photos/400/600?random=5',
                    'https://picsum.photos/400/600?random=5',
                    'https://picsum.photos/400/600?random=5',
                    'https://picsum.photos/400/600?random=5',
                ],
                offsetX: 0,
                rotate: 0,
                opacity: 1,
            },
        ];
        res.status(200).json({
            status: 'success',
            data: {
                message: 'Swipe list fetched successfully!',

                swipeList: swipeData,
            },
        });
    } catch (error: any) {
        res.status(400).json({
            status: 'error',
            error_message: error.message,
        });
    }
};
export default swipeList;
