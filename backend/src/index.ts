import app from './app';
import { createSchemas } from './db';

const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => {

//   console.log(`Server is running on port ${PORT}`);
// });
const startServer = async () => {
    try {
        await createSchemas(); // Create all schemas before starting the server

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error);
        process.exit(1); // Exit process if schema creation fails
    }
};

startServer();
