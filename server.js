const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const port = 3000;
const session = require('express-session');

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const usersFilePath = path.join(__dirname, 'data', 'users.txt');
const petsFilePath = path.join(__dirname, 'data', 'pets.txt');

app.get('/', (req, res) => {
    res.render('Home', { title: 'Home Page', currentPage: 'home', username: req.session.username });
});

app.get('/FindADogOrCat', (req, res) => {
    res.render('FindADogOrCat', { title: 'Find A Dog Or Cat', currentPage: 'find', username: req.session.username });
});

app.get('/DogCare', (req, res) => {
    res.render('DogCare', { title: 'Dog Care', currentPage: 'dogcare', username: req.session.username });
});

app.get('/CatCare', (req, res) => {
    res.render('CatCare', { title: 'Cat Care', currentPage: 'catcare', username: req.session.username });
});

app.get('/GiveAwayPet', (req, res) => {
    if (!req.session.username) {
        return res.render('GiveAwayLogin', { title: 'Login to Give Away Pet', currentPage: 'login', username: req.session.username });
    }
    res.render('GiveAwayPet', { title: 'Give Away Pet', currentPage: 'giveaway', username: req.session.username});
});

app.post('/GiveAwayLogin', (req, res) => {
    const { username, password } = req.body;
    fs.readFile(path.join(__dirname, 'data', 'users.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users file:', err);
            return res.status(500).send('Internal server error.');
        }
        const usernames = data.split('\n').map((line) => line.split(':')[0]);
        const passwords = data.split('\n').map((line) => line.split(':')[1]);
        
        if (!usernames.includes(username) || !passwords.includes(password)) {
            return res.status(401).send(`
                <script>
                    alert("Login failed. Please try again.");
                    window.location.href = '/GiveAwayPet';
                </script>
            `);
        }
        const userIndex = usernames.indexOf(username);
        const userPassword = passwords[userIndex];
        if (userPassword !== password) {
            return res.status(401).send(`
                <script>
                    alert("Login failed. Username and password do not match. Please try again.");
                    window.location.href = '/GiveAwayPet';
                </script>
            `);
        }
        req.session.username = username;
        res.redirect('/GiveAwayPet');
    });
});

app.get('/ContactUs', (req, res) => {
    res.render('ContactUs', { title: 'Contact Us', currentPage: 'contact', username: req.session.username });
});

app.get('/Disclaimer', (req, res) => {
    res.render('Disclaimer', { title: 'Disclaimer', currentPage: 'disclaimer', username: req.session.username });
});

app.post('/pets', (req, res) => {
    const petType = req.body.petType;
    const petAge = req.body.age;
    const breedOption = req.body.breedOption;
    const breed = req.body.breed;
    const gender = req.body.gender;
    const getAlong = Array.isArray(req.body.getAlong) ? req.body.getAlong : [req.body.getAlong];

    let getsAlongWithDogs = 'No';
    let getsAlongWithCats = 'No';
    let getsAlongWithKids = 'No';
    
    if(getAlong.includes('none') || getAlong.length === 0 || typeof(getAlong) == "undefined") {
        // all values remain 'No'
    } else {
        getsAlongWithDogs = getAlong.includes('otherDogs') ? 'Yes' : 'No';
        getsAlongWithCats = getAlong.includes('otherCats') ? 'Yes' : 'No';
        getsAlongWithKids = getAlong.includes('smallKids') ? 'Yes' : 'No';
    }
    
    fs.readFile(petsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading pets file:', err);
            return res.status(500).send('Internal server error');
        }
        const pets = data.split('\n').filter(line => line.trim() !== '').map(line => {
            const fields = line.split(':');
            if (fields.length < 10) {
                console.error(`Invalid line format: ${line}`);
                return null;
            }
            const [id, owner, petName, type, breed, age, gender, dogs, cats, kids, description] = line.split(':');
            return {
                id,
                owner,
                petName,
                type,
                breed,
                age,
                gender,
                getsAlongWithDogs: dogs.split('=')[1],
                getsAlongWithCats: cats.split('=')[1],
                getsAlongWithKids: kids.split('=')[1],
                description
            };
        });

        const matchingPets = pets.filter(pet => {
            const matchesType = !petType || pet.type.toLowerCase() === petType.toLowerCase();
            const matchesAge = !petAge || petAge === "Any" || (parseInt(pet.age) >= parseInt(petAge.split('-')[0]) && parseInt(pet.age) <= parseInt(petAge.split('-')[1])) || (petAge === "10+" && parseInt(pet.age) >= 10);
            const matchesBreed = breedOption === 'any' || (breedOption === 'specify' && breed && pet.breed.toLowerCase().includes(breed.toLowerCase().trim()));
            const matchesGender = !gender || gender === 'any' || pet.gender.toLowerCase() === gender.toLowerCase();
            const matchesDogs = getsAlongWithDogs === 'Yes' ? pet.getsAlongWithDogs === 'Yes' : true;
            const matchesCats = getsAlongWithCats === 'Yes' ? pet.getsAlongWithCats === 'Yes' : true;
            const matchesKids = getsAlongWithKids === 'Yes' ? pet.getsAlongWithKids === 'Yes' : true;
        
            return matchesType && matchesAge && matchesBreed && matchesGender && matchesDogs && matchesCats && matchesKids;
        });

        res.render('pets', { title: 'Pets', pets: matchingPets, currentPage: 'pets', username: req.session.username });
    });
});

app.get('/CreateAccount', (req, res) => {
    res.render('CreateAccount', { title: 'Create Account', currentPage: 'create', username: req.session.username });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.post('/CreateAccount', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).send(`
            <script>
                alert('All fields are required. Please fill in all fields.');
                window.location.href = '/CreateAccount';
            </script>
        `);
    }

    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const validChars = /^[a-zA-Z0-9]{4,}$/;
    const hasLetter = /[a-zA-Z]/;
    const hasDigit = /\d/;

    if (!usernameRegex.test(username)) {
        return res.status(400).send(`
            <script>
                alert('Username already exists. Please choose another one.');
                window.location.href = '/CreateAccount';
            </script>
        `);
    }
    
    if (!validChars.test(password) || !hasLetter.test(password) || !hasDigit.test(password)) {
        return res.status(400).send(`
            <script>
                alert('Password rules were not followed. Try again.');
                window.location.href = '/CreateAccount';
            </script>
        `);
    }
    const userData = `${username}:${password}`;
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users file:', err);
            return res.status(500).send(`
                <script>
                    alert('Internal server error. Please try again later.');
                    window.location.href = '/CreateAccount';
                </script>
            `);
        }
        const users = data.split('\n').map((line) => line.split(':')[0]);
        if (users.includes(username)) {
            return res.status(400).send(`
                <script>
                    alert('Username already exists. Try again.');
                    window.location.href = '/CreateAccount';
                </script>
            `);
        }

        fs.appendFile(usersFilePath, `${userData}\n`, (err) => {
            if (err) {
                console.error('Error saving user data:', err);
                return res.status(500).send(`
                    <script>
                        alert('Internal server error. Please try again later.');
                        window.location.href = '/CreateAccount';
                    </script>
                `);
            }
            console.log('Account created successfully!');
            return res.status(201).send(`
                <script>
                    alert('Account created successfully! You can now log in whenever you\\'re ready in the "Have a pet to give away" section.' );
                    window.location.href = '/';
                </script>
            `);
        });
    });
});

app.post('/SubmitGiveAwayPet', (req, res) => {
    if (!req.session.username) {
        return res.status(401).send(`
            <script>
                alert('Unauthorized. Please log in to submit pet information.');
                window.location.href = '/GiveAwayPet';
            </script>
        `);
    }
    
    const petName = req.body.petName;
    const petType = req.body.petType;
    let breed = req.body.breed;
    if(breed === "pure"){
        breed = req.body.pureBreed;
    }
    else if(breed === "mixed"){
        breed = req.body.mixedBreed;
    }
    const age = req.body.age;
    const gender = req.body.gender;

    const getAlong = Array.isArray(req.body.getAlong) ? req.body.getAlong : [req.body.getAlong];

    let getsAlongWithDogs = 'No';
    let getsAlongWithCats = 'No';
    let getsAlongWithKids = 'No';
    
    if(getAlong.includes('none') || getAlong.length === 0 || typeof(getAlong) == "undefined") {
        // all values remain 'No'
    } else {
        getsAlongWithDogs = getAlong.includes('otherDogs') ? 'Yes' : 'No';
        getsAlongWithCats = getAlong.includes('otherCats') ? 'Yes' : 'No';
        getsAlongWithKids = getAlong.includes('smallKids') ? 'Yes' : 'No';
    }

    const additionalInfo = req.body.additionalInfo;
    
    fs.readFile(petsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading pets file:', err);
            return res.status(500).send('Internal server error.');
        }
        const Ids = data.split('\n').filter(line => line.trim() !== '').map(line => line.split(':')[0]);
        const lastId = parseInt(Ids[Ids.length - 1]) || 0;
        let newId = lastId + 1;

        const petRecord = `${newId}:${req.session.username}:${petName}:${petType}:${breed}:${age}:${gender}:Dogs=${getsAlongWithDogs}:Cats=${getsAlongWithCats}:Kids=${getsAlongWithKids}:${additionalInfo}`;
        fs.appendFile(petsFilePath, petRecord + '\n', (err) => {
            if (err) {
                console.error('Error saving pet data:', err);
                return res.status(500).send('Internal server error.');
            }
            res.send(`
                <script>
                    alert("Pet information submitted successfully!");
                    window.location.href = '/';
                </script>
            `);
        });
    });
});

app.get('/Logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal server error.');
        }
        res.send(`
            <script>
                alert("You have been logged out successfully.");
                window.location.href = '/';
            </script>
        `);
    });
});