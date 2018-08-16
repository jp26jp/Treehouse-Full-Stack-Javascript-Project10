let express   = require("express"),
    router    = express.Router(),
    Sequelize = require("sequelize"),
    Loan      = require("../models").Loan,
    Book      = require("../models").Book,
    Patron    = require("../models").Patron

/* GET loans listing. */
router.get("/", (req, res) => {
    Loan.findAll({include: [{all: true}]})
        .then(loans => {
            console.log(loans)
            res.render("loans/index", {
                title: "Loans",
                loans: loans,
            })
        })
})

/* GET overdue listing. */
router.get("/overdue", (req, res) => {
    const Op = Sequelize.Op
    Loan.findAll({
                     include: [{all: true}],
                     where  : {
                         return_by  : {[Op.lt]: new Date()},
                         returned_on: null
                     }
                 })
        .then(loans => {
            console.log(loans)
            res.render("loans/index", {
                title: "Overdue",
                loans: loans,
            })
        })
})

/* GET checked-out listing. */
router.get("/checked-out", (req, res) => {
    Loan.findAll({
                     include: [{all: true}],
                     where  : {
                         returned_on: null
                     }
                 })
        .then(loans => {
            console.log(loans)
            res.render("loans/index", {
                title: "Checked Out",
                loans: loans,
            })
        })
})

/* Create a new loan form. */
router.get("/new", (req, res) => {
    const promiseBooks   = new Promise(resolve => {
              Book.findAll({include: [{all: true}]})
                  .then(books => {
                      const availableBooks = books.filter(book => {
                
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
                      resolve(availableBooks)
                  })
          }),
          promisePatrons = getAllPatrons()
    
    renderNewLoanPage(res, promiseBooks, promisePatrons, "Create New Loan")
})

/* POST create loan. */
router.post("/", (req, res) => {
    Loan.create(req.body)
        .then(loan => {
            res.redirect("/loans/return/" + loan.id)
        })
        .catch(error => {
            if (error.name === "SequelizeValidationError") {
                const promiseBooks   = getAllBooks(),
                      promisePatrons = getAllPatrons()
                renderNewLoanPage(res, promiseBooks, promisePatrons, "Create New Loan", error.errors)
            }
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

router.get("/return/:id", function (req, res) {
    Loan.findById((req.params.id), {
            include: [{all: true}],
        })
        .then(loan => {
            if (loan) {
                res.render("loans/return", {
                    loan     : loan,
                    book_id  : loan.book_id,
                    patron_id: loan.patron_id,
                    loaned_on: loan.loaned_on,
                    return_by: loan.return_by,
                    button   : "Return Book",
                })
            }
        })
})

router.put("/return/:id", function (req, res) {
    Loan.findById(req.params.id)
        .then(loan => {
            if (loan) {
                return loan.update(req.body)
            }
        })
        .then(() => res.redirect("/loans/"))
})

function getAllBooks() {
    return new Promise(resolve => {
        Book.findAll({
                         include: [{all: true}],
                         order  : [["createdAt", "DESC"]]
                     })
            .then(books => resolve(books))
    })
}

function getAllPatrons() {
    return new Promise(resolve => {
        Patron.findAll({include: [{all: true}]})
              .then(patrons => resolve(patrons))
    })
}

function renderNewLoanPage(expressResponse, books, patrons, buttonText, errors = "undefined") {
    Promise.all([books, patrons])
           .then(results => {
               expressResponse.render("loans/new", {
                   title  : "Loans",
                   books  : results[0],
                   errors : errors,
                   patrons: results[1],
                   button : buttonText,
                   loan   : {},
               })
           })
}

module.exports = router