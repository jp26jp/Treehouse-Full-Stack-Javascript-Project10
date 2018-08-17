"use strict"
module.exports = (sequelize, DataTypes) => {
    var Patron = sequelize.define("Patron", {
        first_name: {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: {msg: "Cannot be empty"},
            }
        },
        last_name : {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: {msg: "Cannot be empty"},
            }
        },
        address   : {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: {msg: "Cannot be empty"},
            }
        },
        email     : {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: {msg: "Cannot be empty"},
            }
        },
        library_id: {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: {msg: "Cannot be empty"},
            }
        },
        zip_code  : {
            type    : DataTypes.INTEGER,
            validate: {
                notEmpty: {msg: "Cannot be empty"},
                isInt   : {msg: "Value must be a zip code (e.g. 84108"},
            }
        }
    }, {})
    Patron.associate = function (models) {
        Patron.hasMany(models.Loan, {foreignKey: "patron_id"})
    }
    return Patron
}