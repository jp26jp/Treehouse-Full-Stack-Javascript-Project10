var express   = require("express"),
    router    = express.Router(),
    Sequelize = require("sequelize"),
    Book      = require("../models").Book,
    Loan      = require("../models").Loan

/* GET index */
router.get("/", (req, res) => {
    Book.findAll()
        .then(books => {
            res.render("books/index", {title: "Books", books: books})
        })
        .catch(error => res.status(500).send(error))
})

/* GET new */
router.get("/new", (req, res) => {
    res.render("books/new", {
        title: "New Book", button: "Create New Book", book: {}
    })
})

/* POST new */
router.post("/new", (req, res) => {
    Book.create(req.body)
        .then(book => res.redirect("/books/"))
        .catch(error => {
            if (error.name === "SequelizeValidationError") {
                res.render("books/new", {
                    title: "New Book", book: Book.build(req.body), errors: error.errors, button: "Create New Book",
                })
            }
        })
})

/* GET id */
router.get("/:id", (req, res) => {
    Book.findById(req.params.id)
        .then(book => {
            if (book) {
                res.render("books/show", {
                    title : book.title,
                    book  : book,
                    button: "Update Book",
                })
            }
            else {
                res.send(404)
            }
        })
        .catch(error => res.status(500).send(error))
})

/* PUT id */
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
        .then(book => res.redirect("/books/"))
        .catch(error => {
            if (error.name === "SequelizeValidationError") {
                let book = Book.build(req.body)
                book.id = req.params.id
                res.render("books/new", {
                    title : book.title,
                    book  : book,
                    errors: error.errors,
                    button: "Update Book",
                })
            }
        })
})

/* GET overdue */
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

/* GET checked-out */
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

module.exports = router


