var express = require("express");
let Books = require('./BooksSchema');
let mongodbConnected = require('./MongoDBConnect');
const cors = require('cors');
var app = express();
var bodyparser = require("body-parser");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());

console.log("BOOKS", Books);

app.get('/', function (req, res) {
  res.send("Welcome to the Books API!");
});

app.get('/about', function (req, res) {
  res.send("MongoDB, Express, React, and Mongoose app. React runs in another application.");
  Books.countDocuments()
    .exec()
    .then(count => {
      console.log("Total documents count before addition:", count);
    })
    .catch(err => {
      console.error(err);
    });
});

app.get('/allbooks1', async (req, res) => {
  const d = await Books.find();
  return res.json(d);
});

app.get('/getbook/:id', function (req, res) {
  let id = req.params.id;
  Books.findById(id, function (err, book) {
    if (err) {
      res.status(404).send("Book not found.");
    } else {
      res.json(book);
    }
  });
});

app.post('/addbooks', function (req, res) {
  console.log("Ref", req.body);
  let newbook = new Books(req.body);
  console.log("newbook->", newbook);
  newbook
    .save()
    .then(todo => {
      res.status(200).json({ books: 'Book added successfully' });
    })
    .catch(err => {
      res.status(400).send('Adding new book failed');
    });
});

app.post('/updatebook/:id', function (req, res) {
  let id = req.params.id;
  let updatedbook = req.body; // No need to create a new Books instance for updating
  console.log("Update id:", id, "Updated book->", updatedbook);

  Books.findByIdAndUpdate(
    id,
    {
      booktitle: updatedbook.booktitle,
      PubYear: updatedbook.PubYear,
      author: updatedbook.author,
      Topic: updatedbook.Topic,
      formate: updatedbook.formate,
    },
    function (err, docs) {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating book");
      } else {
        res.status(200).json({ books: 'Book updated successfully' });
      }
    }
  );
});

app.post('/deleteBook/:id', function (req, res) {
  let id = req.params.id;
  console.log("Deleting book with id:", id);
  Books.findByIdAndDelete(id, function (err, docs) {
    if (err) {
      console.log(err);
      res.status(500).send("Error deleting book");
    } else {
      res.status(200).send('Book deleted successfully');
    }
  });
});

app.listen(5000, function () {
  console.log("Server is running on port 5000");
});
