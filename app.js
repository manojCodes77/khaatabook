let express = require('express');
let app = express();
let path = require('path');
let fs = require('fs');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route to render the index page
app.get('/', (req, res) => {
    fs.readdir(`./hisaab`, (err, files) => {
        //here we get files in the form of array
        if (err) return res.status(500).send('Error on the server.');

        res.render('index', { files: files });//yaha par hun index page me files pass kar rahe hai jo hamara data hai
    })
});

app.get("/create", (req, res) => {
    // Check for error query parameter and handle accordingly
    const { error } = req.query;
    let errorMessage = '';
    if (error === 'missing_fields') {
        errorMessage = 'Please enter title and details';
    }
    res.render('create', { errorMessage });
});

app.get("/edit/:filename", (req, res) => {
    fs.readFile(`./hisaab/${req.params.filename}`, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error on the server.');
        res.render('edit', { filename: req.params.filename, data: data });
    });
});
    
app.get("/delete/:filename", (req, res) => {
    fs.unlink(`./hisaab/${req.params.filename}`, (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

app.post("/update/:filename", (req, res) => {
    fs.writeFile(`./hisaab/${req.params.filename}`, req.body.details, (err) => {
        if (err) return res.status(500).send('Error on the server.');
        res.redirect('/');
    });
});

app.post("/createhisaab", (req, res) => {
    const { title, details } = req.body;
    if (title && details) {
        fs.writeFile(`./hisaab/${title}`, details, (err) => {
            if (err) return res.status(500).send('Error saving the file.');
            res.redirect('/');
        });
    }
    else {
        // Redirect with a query parameter indicating the error
        res.redirect('/create?error=missing_fields');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});