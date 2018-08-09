"use strict"
module.exports = (sequelize, DataTypes) => {
    var Loan = sequelize.define("Loan", {
        book       : DataTypes.INTEGER,
        patron_id  : DataTypes.INTEGER,
        loaned_on  : DataTypes.DATE,
        return_by  : DataTypes.DATE,
        returned_on: DataTypes.DATE,
    }, {})
    Loan.associate = function (models) {
        // Loan.belongsTo(models.Patron)
        // Loan.belongsTo(models.Book)
    }
    return Loan
}