var express   = require("express"),
    router    = express.Router(),
    Sequelize = require("sequelize"),
    Book      = require("../models").Book,
    Loan      = require("../models").Loan

/* GET books listing. */
router.get("/", (req, res) => {
    Book.findAll()
        .then(books => res.render("books/index", {
            title : "Books",
            errors: "undefined",
            books : books,
        }))
        .catch(error => res.status(500).send(error))
})

/* Create a new book form. */
router.get("/new", (req, res) => res.render("books/new", {
    title : "New Book",
    errors: "undefined",
    button: "Create New Book",
    book  : {}
}))

/* GET overdue books */
router.get("/overdue", (req, res) => {
    const Op = Sequelize.Op
    Loan.findAll({
                     include: [{model: Book}],
                     where  : {
                         return_by  : {[Op.lt]: new Date()},
                         returned_on: null
                     }
                 })
        .then(loans => {
            if (loans) {
                res.render("books/overdue", {
                    title: "Overdue Books",
                    loans: loans
                })
            }
            else {
                res.send(404)
            }
        })
        .catch(error => res.status(500).send(error))
})

/* GET checked-out books */
router.get("/checked-out", (req, res) => {
    Loan.findAll({
                     include: [{model: Book}],
                     where  : {returned_on: null}
                 })
        .then(loans => {
            if (loans) {
                res.render("books/overdue", {
                    title: "Checked Out Books",
                    loans: loans
                })
            }
            else {
                res.send(404)
            }
        })
        .catch(error => res.status(500).send(error))
})

/* POST create book. */
router.post("/", (req, res) => {
    Book.create(req.body)
        .then(res.redirect("/books/"))
        .catch(error => {
            if (error.name === "SequelizeValidationError") {
                res.render("books/new", {
                    title : "New Book",
                    book  : Book.build(req.body),
                    errors: error.errors,
                    button: "Create New Book",
                })
            }
        })
})

/* GET individual book. */
router.get("/:id", function (req, res, next) {
    Book.findById(req.params.id)
        .then(book => {
            if (book) {
                res.render("books/show", {
                    book           : book,
                    title          : book.title,
                    author         : book.author,
                    genre          : book.genre,
                    first_published: book.first_published,
                    errors         : "undefined",
                    button         : "Update Book",
                })
            }
            else {
                res.send(404)
            }
        })
        .catch(error => res.status(500).send(error))
})

/* PUT update book. */
router.put("/:id", (req, res) => {
    Book.findById(req.params.id)
        .then(book => {
            if (book) {
                return book.update(req.body)
            }
            else {
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
            }
        })
        .catch(error => res.status(500).send(error))
})

module.exports = router