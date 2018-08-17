"use strict"
module.exports = (sequelize, DataTypes) => {
    var Book = sequelize.define("Book", {
        title          : {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: {msg: "Cannot be empty"},
            }
        },
        author         : {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: {msg: "Cannot be empty"},
            }
        },
        genre          : {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: {msg: "Cannot be empty"},
            }
        },
        first_published: {
            type    : DataTypes.INTEGER,
            validate: {
                notEmpty: {msg: "Cannot be empty"},
                isInt   : {msg: "Value must be a year (e.g. 2018"},
            }
        }
    }, {})
    Book.associate = function (models) {
        Book.hasMany(models.Loan, {foreignKey: "book_id"})
    }
    return Book
}