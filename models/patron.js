"use strict"
module.exports = (sequelize, DataTypes) => {
    var Patron = sequelize.define("Patron", {
        first_name: {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: true,
            }
        },
        last_name : {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: true,
            }
        },
        address   : {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: true,
            }
        },
        email     : {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: true,
            }
        },
        library_id: {
            type    : DataTypes.STRING,
            validate: {
                notEmpty: true,
            }
        },
        zip_code  : {
            type    : DataTypes.INTEGER,
            validate: {
                notEmpty: true,
                isInt   : true,
            }
        }
    }, {})
    Patron.associate = function (models) {
        Patron.hasMany(models.Loan, {foreignKey: "patron_id"})
    }
    return Patron
}