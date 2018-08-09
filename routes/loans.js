let express = require("express"),
    router  = express.Router(),
    Loan    = require("../models").Loan,
    Book    = require("../models").Book,
    Patron  = require("../models").Patron

/* GET loans listing. */
router.get("/", (req, res) => {
    Loan.findAll({order: [["createdAt", "DESC"]]})
        .then(loans => res.render("loans/index", {
            title: "Loans",
            loans: loans,
        }))
        .catch(error => res.send(500).send(error))
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
            console.log(req.body)
            res.redirect("/loans/" + loan.id)
        })
})

// /* Delete loan form. */
// router.get("/:id/delete", (req, res, next) => {
//     Loan.findById(req.params.id).then(function (loan) {
//         if (loan) {
//             res.render("loans/delete", {loan: loan, title: "Delete Loan"})
//         } else {
//             res.send(404)
//         }
//     }).catch(function (error) {
//         res.send(500, error)
//     })
// })

/* GET individual loan. */
router.get("/:id", function (req, res) {
    Loan.findById(req.params.id)
        .then(loan => {
            if (loan) {
                res.render("loans/show", {
                    loan     : loan,
                    book_id  : loan.book_id,
                    // patron_id : loan.patron_id,
                    loaned_on: loan.loaned_on,
                    return_by: loan.return_by,
                })
            } else {
                res.send(404)
            }
        })
        .catch(error => res.send(500).send(error))
})

/* PUT update loan. */
router.put("/:id", (req, res) => {
    Loan.findById(req.params.id)
        .then(loan => {
            if (loan) {
                return loan.update(req.body)
            } else {
                res.send(404)
            }
        })
        .then(loan => res.redirect("/loans/" + loan.id))
        .catch(error => {
            if (error.name === "SequelizeValidationError") {
                var loan = Loan.build(req.body)
                loan.id = req.params.id
                res.render("loans/edit", {
                    loan  : loan,
                    errors: error.errors,
                    title : "Edit Loan",
                })
            } else {
                throw error
            }
        })
        .catch(error => res.send(500).send(error))
})
//
// /* DELETE individual loan. */
// router.delete("/:id", (req, res, next) => {
//     Loan.findById(req.params.id).then(function (loan) {
//         if (loan) {
//             return loan.destroy()
//         } else {
//             res.send(404)
//         }
//     }).then(function () {
//         res.redirect("/loans")
//     }).catch(function (error) {
//         res.send(500, error)
//     })
// })

module.exports = router