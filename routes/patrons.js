const express = require("express")
const router = express.Router()
const Patron = require("../models").Patron

/* GET patrons listing. */
router.get("/", (req, res) => {
    Patron.findAll({order: [["createdAt", "DESC"]]})
          .then(patrons => {
              res.render("patrons/index", {
                  title  : "Patrons",
                  patrons: patrons,
              })
          })
          .catch(error => res.send(500, error))
})

/* Create a new patron form. */
router.get("/new", (req, res) => {
    res.render("patrons/new", {
        title : "New Patron",
        errors: "undefined",
        button: "Create New Patron",
        patron: {},
    })
})

/* POST create patron. */
router.post("/", (req, res) => {
    Patron.create(req.body)
          .then(patron => res.redirect("/patrons/" + patron.id))
          .catch(error => {
              if (error.name === "SequelizeValidationError") {
                  res.render("patrons/new", {
                      title : "New Patron",
                      patron: Patron.build(req.body),
                      errors: error.errors,
                      button: "Create New Patron",
                  })
              }
          })
})

/* GET individual patron. */
router.get("/:id", function (req, res) {
    Patron.findById(req.params.id)
          .then(patron => {
              if (patron) {
                  res.render("patrons/show", {
                      patron    : patron,
                      first_name: patron.first_name,
                      last_name : patron.last_name,
                      address   : patron.address,
                      email     : patron.email,
                      library_id: patron.library_id,
                      zip_code  : patron.zip_code,
                      button    : "Update Patron",
                      errors    : "undefined",
                  })
              } else {
                  res.send(404)
              }
          })
          .catch(error => res.send(500, error))
})

/* PUT update patron. */
router.put("/:id", (req, res) => {
    Patron.findById(req.params.id)
          .then(patron => {
              if (patron) {
                  return patron.update(req.body)
              } else {
                  res.send(404)
              }
          })
          .then(patron => res.redirect("/patrons/" + patron.id))
          .catch(error => {
              if (error.name === "SequelizeValidationError") {
                  var patron = Patron.build(req.body)
                  patron.id = req.params.id
                  res.render("patrons/edit", {
                      patron: patron,
                      errors: error.errors,
                      title : "Edit Patron",
                  })
              } else {
                  throw error
              }
          })
          .catch(error => res.send(500, error))
})

module.exports = router