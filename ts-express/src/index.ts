import express,{ json } from 'express';
import userRoute from './module/user/user.route'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

app.use('/user', userRoute)

app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to your API!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
