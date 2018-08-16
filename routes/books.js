var express = require("express"),
    router  = express.Router(),
    Book    = require("../models").Book,
    Loan    = require("../models").Loan

/* GET books listing. */
router.get("/", (req, res) => {
    Book.findAll({order: [["createdAt", "DESC"]]})
        .then(books => res.render("books/index", {
            title: "Books",
            books: books,
        }))
        .catch(error => res.send(500, error))
})

/* Create a new book form. */
router.get("/new", (req, res) => res.render("books/new", {
    title : "New Book",
    button: "Create New Book",
    book  : {}
}))

/* GET overdue books */
router.get("/overdue", (req, res) => {
    Loan.findAll({order: [["createdAt", "DESC"]]})
        .then(books => res.render("books/index", {
            title: "Overdue Books",
            books: books,
        }))
        .catch(error => res.send(500, error))
})

/* POST create book. */
router.post("/", (req, res) => {
    Book.create(req.body)
        .then(book => res.redirect("/books/" + book.id))
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

/* GET individual book. */
router.get("/:id", function (req, res) {
    Book.findById(req.params.id)
        .then(book => {
            if (book) {
                res.render("books/show", {
                    book           : book,
                    title          : book.title,
                    author         : book.author,
                    genre          : book.genre,
                    first_published: book.first_published,
                    button         : "Update Book",
                })
            } else {
                res.send(404)
            }
        })
        .catch(error => res.send(500, error))
})

/* PUT update book. */
router.put("/:id", (req, res) => {
    Book.findById(req.params.id)
        .then(book => {
            if (book) {
                return book.update(req.body)
            } else {
                res.send(404)
            }
        })
        .then(book => res.redirect("/books/" + book.id))
        .catch(error => {
            if (error.name === "SequelizeValidationError") {
                var book = Book.build(req.body)
                book.id = req.params.id
                res.render("books/edit", {
                    book  : book,
                    errors: error.errors,
                    title : "Edit Book",
                })
            } else {
                throw error
            }
        })
        .catch(error => res.send(500, error))
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