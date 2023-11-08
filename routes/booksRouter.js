const express = require('express');
const router = express.Router();

const booksMulter = require('../middleware/booksMulter')

router.get('/', (req, res) => {
    const {url} = req;
    res.json({url});
});

const { v4: uuid } = require('uuid');

class Book {
    constructor(title = '', authors = '', description = '', favorite = '', fileCover = '', fileName = '', fileBook = '') {
        this.title = title;
        this.authors = authors;
        this.description = description;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.id = uuid();
        this.fileBook = fileBook;   //новое поле
    }
}

const stor = {
    books: [],
    user: {
        id: 1, 
        mail: "test@mail.ru",
    },
}

router.get('/api/books', (req, res) => {
    const {books} = stor;
    res.json(books);
});

router.post('/api/user/login', (req, res) => {
    const {user} = stor;
    res.status(201);
    res.json(user);
});

router.post('/api/books', 
    booksMulter.single('filebook'), 
    (req, res) => {
    const {books} = stor;
    const {
        title, 
        authors, 
        description, 
        favorite, 
        fileCover, 
        fileName
    } = req.body;


    if (!req.file) {
        res.status(404);
        res.json('404 | ФАЙЛ не найден');
        return;
    }
    const fileBook = req.file.path;
    

    const newBook = new Book(
        title, 
        authors, 
        description, 
        favorite, 
        fileCover, 
        fileName,
        fileBook
    );
    books.push(newBook);

    res.status(201);
    res.json(newBook);
});

router.get('/api/books/:id', (req, res) => {
    const {books} = stor;
    const {id} = req.params;
    const idx = books.findIndex((el) => el.id === id);
    if (idx !== -1) {
        res.json(books[idx]);
    } else { 
        res.status(404);
        res.json('404 | Страница не найдена')
    }

});

router.put('/api/books/:id', 
    booksMulter.single('filebook'), 
    (req, res) => {
    const {books} = stor;
    const {
        title, 
        authors, 
        description, 
        favorite, 
        fileCover, 
        fileName
    } = req.body;


    if (!req.file) {
        res.status(404);
        res.json('404 | ФАЙЛ не найден');
        return;
    }
    const fileBook = req.file.path;

    const {id} = req.params;
    const idx = books.findIndex((el) => el.id === id);

    if (idx !== -1) {
        books[idx] = {
            ...books[idx],
            title, 
            authors, 
            description, 
            favorite, 
            fileCover, 
            fileName,
            fileBook
        }
        res.json(books[idx]);
    } else { 
        res.status(404);
        res.json('404 | СТРАНИЦА не найдена')
    }
});

router.delete('/api/books/:id', (req, res) => {
    const {books} = stor;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);
    if (idx !== -1) {
        books.splice(idx, 1);
        res.json('Книга удалена')
    } else { 
        res.status(404);
        res.json('404 | страница не найдена')
    }
});

router.get('/api/books/:id/download', (req, res) => {
    const {books} = stor;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);
    if (idx !== -1) {
        res.download(`${__dirname}/../public/books/${books[idx].fileBook}`, books[idx].fileName, err => {
            if (err) {
              res.status(404);
              res.json(err);
            }
        });
    } else { 
        res.status(404);
        res.json('404 | Файл не найден')
    }
});

module.exports = router;
