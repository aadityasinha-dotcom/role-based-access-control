// server.js
const express       = require("express");
const cors          = require("cors");
const cookieSession = require("cookie-session");
const dbConfig      = require("./app/config/db.config");

const app = express();

// ==== Middleware ====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name:   "aaditya-session",
    keys:   [process.env.COOKIE_SECRET || "COOKIE_SECRET"],
    httpOnly: true
  })
);

// ==== Database Connection ====
const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(
    `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    initial();    // seed roles
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// ==== Seed Roles Function ====
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      ["user", "moderator", "admin"].forEach(name => {
        new Role({ name }).save(err => {
          if (err) console.error("Error", err);
          else console.log(`added '${name}' to roles collection`);
        });
      });
    }
  });
}

// ==== Simple Public Route ====
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Aaditya application." });
});

// ==== Import Routes ====
// These modules export a function that takes (app) or an Express Router
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// Mount your new Blog CRUD routes under /api/blogs
app.use("/api/blogs", require("./app/routes/blog.routes"));

// ==== Global Error Handler ====
// (should be after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

// ==== Start Server ====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

