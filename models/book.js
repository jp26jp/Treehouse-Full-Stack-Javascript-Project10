"use strict"
module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define("Book", {
        title          : {
            type     : DataTypes.TEXT,
            allowNull: false,
            unique   : true,
            validate : {
                notEmpty: {msg: "Cannot be empty"},
            }
        },
        author         : {
            type     : DataTypes.TEXT,
            allowNull: false,
            validate : {
                notEmpty: {msg: "Cannot be empty"},
            }
        },
        genre          : {
            type: DataTypes.TEXT
        },
        first_published: {
            type    : DataTypes.INTEGER,
            validate: {
                notEmpty: {msg: "Cannot be empty"},
                isInt   : {msg: "Value must be a year (e.g. 2018"},
            }
        }
    }, {timestamps: false})
    Book.associate = function (models) {
        Book.hasMany(models.Loan, {foreignKey: "book_id"})
    }
    return Book
}