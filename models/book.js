"use strict"
module.exports = (sequelize, DataTypes) => {
    var Book = sequelize.define("Book", {
        title          : DataTypes.STRING,
        author         : DataTypes.STRING,
        genre          : DataTypes.STRING,
        first_published: DataTypes.INTEGER
    }, {})
    Book.associate = function (models) {
        Book.hasMany(models.Loan, {foreignKey: 'book_id'});
    }
    return Book
}