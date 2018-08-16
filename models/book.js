"use strict"
module.exports = (sequelize, DataTypes) => {
    var Book = sequelize.define("Book", {
        title          : {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: true,
            }
        },
        author         : {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: true,
            }
        },
        genre          : {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: true,
            }
        },
        first_published: {
            type    : DataTypes.INTEGER,
            validate: {
                notEmpty: true,
                isInt   : true,
            }
        }
    }, {})
    Book.associate = function (models) {
        Book.hasMany(models.Loan, {foreignKey: "book_id"})
    }
    return Book
}