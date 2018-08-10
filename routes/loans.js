let express = require("express"),
    router  = express.Router(),
    Loan    = require("../models").Loan,
    Book    = require("../models").Book,
    Patron  = require("../models").Patron

/* GET loans listing. */
router.get("/", (req, res) => {
    let loanArray = []
    Loan.findAll({include: [{ all: true }]})
        .then(loans => {
            const loanInfo = new Promise(resolve => {
                for (let i = 0; i < loans.length; i++) {
                    const bookTitle = new Promise(resolve => {
                        Book.findById(loans[i].dataValues.book_id).then(book => resolve(book.title))
                    })
                    const patronName = new Promise(resolve => {
                        Patron.findById(loans[i].dataValues.patron_id).then(patron => resolve(`${patron.first_name} ${patron.last_name}`))
                    })
                    Promise.all([bookTitle, patronName])
                           .then(results => loanArray.push(results))
                           .then(() => resolve(loanArray))
                }
            })
        
            loanInfo.then(function (data) {
                res.render("loans/index", {
                    title: "Loans",
                    loans: loans,
                })
            })
        
        })
})

/* Create a new loan form. */
router.get("/new", (req, res) => {
    const promiseBooks = new Promise(resolve => {
        Book.findAll({order: [["createdAt", "DESC"]]}).then(books => resolve(books))
    })
    const promisePatrons = new Promise(resolve => {
        Patron.findAll({order: [["createdAt", "DESC"]]}).then(patrons => resolve(patrons))
    })
    Promise.all([promiseBooks, promisePatrons]).then(results => {
        res.render("loans/new", {
            title  : "Loans",
            books  : results[0],
            patrons: results[1],
            loan   : {}
        })
    })
})

/* POST create loan. */
router.post("/", (req, res) => {
    Loan.create(req.body)
        .then(loan => {
            res.redirect("/loans/" + loan.id)
        })
})

/* GET individual loan. */
router.get("/:id", function (req, res) {
    Loan.findById(req.params.id)
        .then(loan => {
            if (loan) {
                res.render("loans/show", {
                    loan     : loan,
                    book_id  : loan.book_id,
                    patron_id: loan.patron_id,
                    loaned_on: loan.loaned_on,
                    return_by: loan.return_by,
                })
            } else {
                res.send(404)
            }
        })
        .catch(error => res.send(500).send(error))
})

router.delete("/:id", function (req, res) {
    Loan.findById(req.params.id)
        .then(loan => {
            if (loan) {
                return loan.destroy()
            }
            else {
                res.send(404)
            }
        })
        .then(() => {
            res.redirect("/loans")
        })
})

module.exports = router