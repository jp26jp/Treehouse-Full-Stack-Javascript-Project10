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
            if (loans) {
                res.render("loans/index", {
                    title: "Loans",
                    loans: loans,
                })
            }
            else {
                res.send(404)
            }
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
            if (loans) {
                res.render("loans/index", {
                    title: "Overdue Loans",
                    loans: loans,
                })
            }
            else {
                res.send(404)
            }
        })
})

/* GET checked-out listing. */
router.get("/checked-out", (req, res) => {
    Loan.findAll({
                     include: [{all: true}],
                     where  : {returned_on: null}
                 })
        .then(loans => {
            if (loans) {
                res.render("loans/index", {
                    title: "Checked Out Loans",
                    loans: loans,
                })
            }
            else {
                res.send(404)
            }
        })
})

/* Create a new loan form. */
router.get("/new", (req, res) => {
    const promiseBooks   = new Promise(resolve => {
              Book.findAll({
                               include: [{all: true}]
                           })
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
        .then(loan => res.redirect("/loans/return/" + loan.id))
        .catch(error => {
            if (error.name === "SequelizeValidationError") {
                const promiseBooks   = getAllBooks(),
                      promisePatrons = getAllPatrons()
            
                Promise.all([promiseBooks, promisePatrons])
                       .then(results => {
                           res.render("loans/new", {
                               title  : "New Loan",
                               books  : filterCheckedOutBooks(results[0]),
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
            else {
                res.send(404)
            }
        })
})

router.put("/return/:id", function (req, res) {
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
})

function getAllBooks() {
    return new Promise(resolve => {
        Book.findAll({include: [{all: true}]})
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