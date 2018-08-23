const createError    = require("http-errors"),
      express        = require("express"),
      path           = require("path"),
      cookieParser   = require("cookie-parser"),
      logger         = require("morgan"),
      methodOverride = require("method-override")

const indexRouter   = require("./routes/index"),
      booksRouter   = require("./routes/books"),
      loansRouter   = require("./routes/loans"),
      patronsRouter = require("./routes/patrons")

const app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use(methodOverride("_method"))
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use("/", indexRouter)
app.use("/books", booksRouter)
app.use("/loans", loansRouter)
app.use("/patrons", patronsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get("env") === "development" ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render("error")
})

module.exports = app
