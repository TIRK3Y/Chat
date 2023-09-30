const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb'); // Added ObjectId
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

const mongoURL = 'mongodb://localhost:27017';
const dbName = 'movieTicketBooking';

async function fetchMoviesFromDB() {
    try {
        const client = new MongoClient(mongoURL);
        await client.connect();

        const db = client.db(dbName);
        const moviesCollection = db.collection('movies');
        const movies = await moviesCollection.find({}).toArray();

        client.close();

        return movies;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
}

// Function to fetch movie details based on movieId
async function fetchMovieDetailsFromDB(movieId) {
    try {
        const client = new MongoClient(mongoURL);
        await client.connect();

        const db = client.db(dbName);
        const moviesCollection = db.collection('movies');
        const movie = await moviesCollection.findOne({ _id: ObjectId(movieId) });

        client.close();

        return movie;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
}

app.get('/', async (req, res) => {
    try {
        const user = req.session.user || null;
        const movies = await fetchMoviesFromDB();
        
        res.render('home', { user, movies });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});
//Login & Signup
// Route to display the login popup
app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login',
        formAction: '/login',
        linkText: "Don't have an account?",
        linkURL: '/signup',
        showButtonId: 'showLoginPopup'
    });
});

// Route to display the signup popup
app.get('/signup', (req, res) => {
    res.render('signup', {
        title: 'Signup',
        formAction: '/signup',
        linkText: 'Already have an account?',
        linkURL: '/login',
        showButtonId: 'showSignupPopup'
    });
});


app.get('/book/:movieId', async (req, res) => {
    try {
        const user = req.session.user || null;
        const movieId = req.params.movieId;

        const movie = await fetchMovieDetailsFromDB(movieId); // Fetch movie details
        
        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        res.render('book', { user, movie });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/book/:movieId', async (req, res) => {
    const { movieId } = req.params;
    const { user } = req.session;

    try {
        const client = new MongoClient(mongoURL);
        await client.connect();
        const db = client.db(dbName);
        const moviesCollection = db.collection('movies');
        const bookingsCollection = db.collection('bookings');

        const movie = await moviesCollection.findOne({ _id: ObjectId(movieId) });

        if (!movie) {
            client.close();
            return res.status(404).send('Movie not found');
        }

        const booking = {
            userId: user._id,
            movieId: movie._id,
            timestamp: new Date(),
        };

        const result = await bookingsCollection.insertOne(booking);

        client.close();

        res.render('book', { user, movie, message: 'Ticket booked successfully!' });
    } catch (error) {
        console.error('Error during booking:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/notify/:movieId', async (req, res) => {
    try {
        const user = req.session.user || null;
        const movieId = req.params.movieId;

        const movie = await fetchMovieDetailsFromDB(movieId); // Fetch movie details
        
        if (!movie) {
            return res.status(404).send('Movie not found');
        }

        res.render('notify', { user, movie });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/notify', (req, res) => {
    const user = req.session.user || null;
    res.render('notify', { user });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
