let express = require("express"),
    router  = express.Router(),
    Book    = require("../models").Book,
    Patron  = require("../models").Patron,
    Loan    = require("../models").Loan

/* GET home page. */
router.get("/", function (req, res, next) {
    const books   = getAllBooks(),
          patrons = getAllPatrons(),
          loans   = getAllLoans()
    
    Promise.all([books, patrons, loans])
           .then(results => {
               res.render("index", {
                   title  : "Library Manager",
                   books  : results[0],
                   patrons: results[1],
                   loans  : results[2],
               })
           })
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

function getAllLoans() {
    return new Promise(resolve => {
        Loan.findAll({include: [{all: true}]})
            .then(loans => resolve(loans))
    })
}

module.exports = router
