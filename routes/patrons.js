const express = require("express")
const router = express.Router()
const Patron = require("../models").Patron

/* GET index */
router.get("/", (req, res) => {
    Patron.findAll()
          .then(patrons => {
              res.render("patrons/index", {title: "Patrons", patrons: patrons})
          })
          .catch(error => res.status(500).send(error))
})

/* GET new */
router.get("/new", (req, res) => {
    res.render("patrons/new", {
        title: "New Patron", button: "Create New Patron", patron: {}
    })
})

/* POST new */
router.post("/new", (req, res) => {
    Patron.create(req.body)
          .then(patron => res.redirect("/patrons/"))
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

/* GET id */
router.get("/:id", (req, res) => {
    Patron.findById(req.params.id)
          .then(patron => {
              if (patron) {
                  res.render("patrons/show", {
                      title : patron.title,
                      patron: patron,
                      button: "Update Patron",
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
    Patron.findById(req.params.id)
          .then(patron => {
              if (patron) {
                  return patron.update(req.body)
              }
              else {
                  res.send(404)
              }
          })
          .then(patron => res.redirect("/patrons/"))
          .catch(error => {
              if (error.name === "SequelizeValidationError") {
                  let patron = Patron.build(req.body)
                  patron.id = req.params.id
                  res.render("patrons/new", {
                      title : patron.title,
                      patron: patron,
                      errors: error.errors,
                      button: "Update Patron",
                  })
              }
          })
})

module.exports = router