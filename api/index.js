const express = require('express');
require('dotenv').config();
const cors = require('cors');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const cookiesParser = require('cookie-parser');
const { dbConnection } = require('./database/config');
const imageDownloader = require('image-downloader');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Place = require('./models/Place.js');



const app = express();

dbConnection();

const salt = bcrypt.genSaltSync(12);
const jwtSecret = 'as6da7sf9qw984fva5s4f6a';

app.use(express.json());
app.use(cookiesParser())
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

app.get('/test', (req, res) => {
    res.json('test ok');
});


app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let usuario = await User.findOne({ email })

        if (usuario) {
            return res.status(400).json({
                error: 'La direccion de correo electrónico ya se encuentra registrada.'
            })
        }

        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, salt),
        })

        res.status(201).json(userDoc);

    } catch (error) {
        console.log(error);
        res.status(422).json({
            error: error
        })
    }

});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });

    if (!userDoc) {
        return res.status(404).json({
            error: 'El correo no se encuentra registrado'
        })
    }

    const passOK = bcrypt.compareSync(password, userDoc.password)

    if (passOK) {
        jwt.sign({
            email: userDoc.email,
            id: userDoc._id,
            name: userDoc.name
        }, jwtSecret, {}, (err, token) => {
            if (err) {
                throw err;
            }
            res.cookie('token', token).json(userDoc);
        });
    } else {
        res.status(401).json({ error: 'Contraseña incorrecta.' });
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id });
        });
    } else {
        res.json(null)
    }
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
})

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    const destPath = path.join(__dirname + '/uploads', newName);
    await imageDownloader.image({
        url: link,
        dest: destPath,
    })
    res.json(newName)
})

const picturesMiddleware = multer({ dest: 'uploads' })
app.post('/upload', picturesMiddleware.array('photo', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/', ''));
    }
    res.json(uploadedFiles);
})

app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const {
        title, address, addedPhotos,
        description, perks, checkIn,
        checkOut, maxGuests, price
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.create({
            owner: userData.id,
            title, address, photos: addedPhotos,
            description, perks, checkIn,
            checkOut, maxGuests, price,
        })
        res.json(placeDoc);
    });

});

app.get('/user-places', (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const { id } = userData;
        res.json(await Place.find({ owner: id }));
    });

})

app.get('/places/:id', async (req, res) => {
    const { id } = req.params;

    res.json(await Place.findById(id));
})

app.put('/places', async (req, res) => {
    const { token } = req.cookies;
    const {
        id, title, address, addedPhotos,
        description, perks, checkIn,
        checkOut, maxGuests, price,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title, address, photos: addedPhotos,
                description, perks, checkIn,
                checkOut, maxGuests, price,
            });
            await placeDoc.save();
            res.json('ok');
        }
    });
});

app.get('/places', async (req, res) => {
    res.json(await Place.find());
})

app.post('/bookings', async (req, res) => {
    const { token } = req.cookies;
    const {
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
    } = req.body;

    try {
        const userData = jwt.verify(token, jwtSecret);
        
        const placeBooking = await Booking.create({
            place, checkIn, checkOut, numberOfGuests, name, phone, price,
            user: userData.id,
        });

        res.json(placeBooking);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        mongoose.connect(process.env.MONGO_URL);

        const userData = await getUserDataFromReq(req);

        const bookings = await Booking.find({ user: userData.id }).populate('place');

        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto: ', process.env.PORT)
});