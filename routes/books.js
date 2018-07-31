var express = require("express")
var router = express.Router()
var Book = require("../models").Book

// /* GET books listing. */
// router.get("/", (req, res, next) => {
//     Book.findAll({order: [["createdAt", "DESC"]]}).then(function (books) {
//         res.render("books/index", {books: books, title: "My Awesome Blog"})
//     }).catch(function (error) {
//         res.send(500, error)
//     })
// })

/* Create a new book form. */
router.get("/new", (req, res, next) => {
    res.render("books/new", {book: {}})
})

/* POST create book. */
router.post("/", (req, res, next) => {
    Book.create(req.body).then(function (book) {
        res.redirect("/books/" + book.id)
    })
})

// /* Delete book form. */
// router.get("/:id/delete", (req, res, next) => {
//     Book.findById(req.params.id).then(function (book) {
//         if (book) {
//             res.render("books/delete", {book: book, title: "Delete Book"})
//         } else {
//             res.send(404)
//         }
//     }).catch(function (error) {
//         res.send(500, error)
//     })
// })
//
/* GET individual book. */
router.get("/:id", function (req, res, next) {
    Book.findById(req.params.id).then(function (book) {
        if (book) {
            res.render("books/show", {
                book           : book,
                title          : book.title,
                author         : book.author,
                genre          : book.genre,
                first_published: book.first_published,
            })
        } else {
            res.send(404)
        }
    }).catch(function (error) {
        res.send(500, error)
    })
})

/* PUT update book. */
router.put("/:id", (req, res, next) => {
    
    Book.findById(req.params.id)
        
        .then(function (book) {
            if (book) {
                return book.update(req.body)
            } else {
                res.send(404)
            }
        })
    
        .then(function (book) {
            res.redirect("/books/" + book.id)
        })
    
        .catch(function (error) {
            if (error.name === "SequelizeValidationError") {
                var book = Book.build(req.body)
                book.id = req.params.id
                res.render("books/edit", {
                    book: book,
                    errors: error.errors,
                    title: "Edit Book"
                })
            } else {
                throw error
            }
        })
    
        .catch(function (error) {
            res.send(500, error)
        })
})
//
// /* DELETE individual book. */
// router.delete("/:id", (req, res, next) => {
//     Book.findById(req.params.id).then(function (book) {
//         if (book) {
//             return book.destroy()
//         } else {
//             res.send(404)
//         }
//     }).then(function () {
//         res.redirect("/books")
//     }).catch(function (error) {
//         res.send(500, error)
//     })
// })

module.exports = router