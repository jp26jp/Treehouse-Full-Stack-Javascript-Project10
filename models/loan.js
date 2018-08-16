"use strict"
module.exports = (sequelize, DataTypes) => {
    var Loan = sequelize.define("Loan", {
        book_id    : {
            type    : DataTypes.INTEGER,
            validate: {
                notEmpty: {msg: "The book is missing an ID"},
            }
        },
        patron_id  : {
            type    : DataTypes.INTEGER,
            validate: {
                notEmpty: {msg: "The patron is missing an ID"},
            }
        },
        loaned_on  : {
            type    : DataTypes.DATE,
            validate: {
                notEmpty: {msg: "Cannot be empty"},
                isDate  : {msg: "Value must be a date (e.g. 1/1/2020)"},
            }
        },
        return_by  : {
            type    : DataTypes.DATE,
            validate: {
                notEmpty: {msg: "Cannot be empty"},
                isDate  : {msg: "Value must be a date (e.g. 1/1/2020"},
            }
        },
        returned_on: {
            type     : DataTypes.DATE,
            allowNull: true,
        }
    }, {})
    Loan.associate = function (models) {
        Loan.belongsTo(models.Book, {foreignKey: "book_id"})
        Loan.belongsTo(models.Patron, {foreignKey: "patron_id"})
    }
    Loan.prototype.getDateAsString = function (aDate) {
        const date = new Date(aDate)
        return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
    }
    Loan.prototype.getDate = function () {
        return this.getDateAsString(new Date())
    }
    return Loan
}