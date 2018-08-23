let express   = require("express"),
    router    = express.Router(),
    Sequelize = require("sequelize"),
    Loan      = require("../models").Loan,
    Book      = require("../models").Book,
    Patron    = require("../models").Patron

/* GET index */
router.get("/", (req, res) => {
    Loan.findAll({include: [{all: true}]})
        .then(loans => {
            res.render("loans/index", {title: "Loans", loans: loans})
        })
        .catch(error => res.status(500).send(error))
})

/* GET new */
router.get("/new", (req, res) => {
    const promiseBooks   = getAllAvailableBooks(),
          promisePatrons = getAllPatrons()
    renderNewLoanPage(res, promiseBooks, promisePatrons, "Create New Loan")
})

/* POST new */
router.post("/new", (req, res) => {
    Loan.create(req.body)
        .then(loan => res.redirect("/loans/"))
        .catch(error => {
            if (error.name === "SequelizeValidationError") {
                const promiseBooks   = getAllAvailableBooks(),
                      promisePatrons = getAllPatrons()
                Promise.all([promiseBooks, promisePatrons])
                       .then(results => {
                           res.render("loans/new", {
                               title  : "New Loan",
                               books  : results[0],
                               patrons: results[1],
                               loan   : Loan.build(req.body),
                               errors : error.errors,
                               button : "Create New Loan",
                           })
                       })
                renderNewLoanPage(res, promiseBooks, promisePatrons, "Create New Loan", error.errors)
            }
        })
})

/* GET overdue */
router.get("/overdue", (req, res) => {
    const Op = Sequelize.Op
    Loan.findAll({include: [{all: true}], where: {return_by: {[Op.lt]: new Date()}, returned_on: null}})
        .then(loans => {
            res.render("loans/index", {title: "Overdue Loans", loans: loans})
        })
})

/* GET checked-out */
router.get("/checked-out", (req, res) => {
    Loan.findAll({include: [{all: true}], where  : {returned_on: null}})
        .then(loans => {
            res.render("loans/index", {title: "Checked Out Loans", loans: loans})
        })
})

/* GET return/:id */
router.get("/return/:id", (req, res) => {
    Loan.findById(req.params.id, {include: [{all: true}]})
        .then(loan => {
            if (loan) {
                res.render("loans/show", {
                    loan     : loan,
                    button   : "Return Book",
                })
            }
            else {
                res.send(404)
            }
        })
        .catch(error => res.status(500).send(error))
})

/* PUT return/:id */
router.put("/return/:id", (req, res) => {
    Loan.findById(req.params.id)
        .then(loan => {
            if (loan) {
                return loan.update(req.body)
            }
            else {
                res.send(404)
            }
        })
        .then(() => res.redirect("/loans/"))
        .catch(error => res.status(500).send(error))
})

function getAllAvailableBooks() {
    return new Promise(resolve => {
        Book.findAll({include: [{all: true}]})
            .then(books => resolve(filterCheckedOutBooks(books)))
    })
}

function getAllPatrons() {
    return new Promise(resolve => {
        Patron.findAll({include: [{all: true}]})
              .then(patrons => resolve(patrons))
    })
}

function renderNewLoanPage(res, books, patrons, buttonText, errors = "undefined") {
    Promise.all([books, patrons])
           .then(results => {
               res.render("loans/new", {
                   title  : "New Loan",
                   books  : results[0],
                   errors : errors,
                   patrons: results[1],
                   button : buttonText,
                   loan   : {},
               })
           })
}

function filterCheckedOutBooks(books) {
    return books.filter(book => {
        let loans = book.dataValues.Loans
        // if true, a loan exist and we need to check if any have not been returned
        if (loans.length) {
            for (let i = 0; i < loans.length; i++) {
                // if a book has not been returned, remove it from the array
                if (loans[i].dataValues.returned_on === null) {
                    return false
                }
            }
        }
        // if no loan exists OR all book loans have been returned, add the book to the array
        return true
    })
}

module.exports = router