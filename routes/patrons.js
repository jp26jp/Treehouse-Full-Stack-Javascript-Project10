const express = require("express")
const router = express.Router()
const Patron = require("../models").Patron

/* GET patrons listing. */
router.get("/", (req, res) => {
    Patron.findAll({order: [["createdAt", "DESC"]]})
        .then(patrons => res.render("patrons/index", {
            title: "Patrons",
            patrons: patrons,
        }))
        .catch(error => res.send(500, error))
})

/* Create a new patron form. */
router.get("/new", (req, res) => res.render("patrons/new", {
    title: "New Patron",
    patron: {},
}))

/* POST create patron. */
router.post("/", (req, res) => {
    Patron.create(req.body)
        .then(patron => res.redirect("/patrons/" + patron.id))
})

// /* Delete patron form. */
// router.get("/:id/delete", (req, res, next) => {
//     Patron.findById(req.params.id).then(function (patron) {
//         if (patron) {
//             res.render("patrons/delete", {patron: patron, title: "Delete Patron"})
//         } else {
//             res.send(404)
//         }
//     }).catch(function (error) {
//         res.send(500, error)
//     })
// })

/* GET individual patron. */
router.get("/:id", function (req, res) {
    Patron.findById(req.params.id)
        .then(patron => {
            if (patron) {
                res.render("patrons/show", {
                    patron: patron,
                    first_name: patron.first_name,
                    last_name: patron.last_name,
                    address: patron.address,
                    email: patron.email,
                    library_id: patron.library_id,
                    zip_code: patron.zip_code,
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
                    title: "Edit Patron",
                })
            } else {
                throw error
            }
        })
        .catch(error => res.send(500, error))
})
//
// /* DELETE individual patron. */
// router.delete("/:id", (req, res, next) => {
//     Patron.findById(req.params.id).then(function (patron) {
//         if (patron) {
//             return patron.destroy()
//         } else {
//             res.send(404)
//         }
//     }).then(function () {
//         res.redirect("/patrons")
//     }).catch(function (error) {
//         res.send(500, error)
//     })
// })

module.exports = router