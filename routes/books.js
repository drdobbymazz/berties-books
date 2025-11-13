// Create a new router
const express = require("express")
const router = express.Router()

router.get('/', function(req, res, next) {
    res.render("index.ejs")
});

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', function (req, res, next) {
    // Get the search keyword and search type from the query parameters
    let keyword = req.query.keyword;
    let searchType = req.query.searchType || 'advanced'; // Default to advanced search
    
    let sqlquery;
    let searchParam;
    
    if (searchType === 'basic') {
        // Basic search: exact match
        sqlquery = "SELECT name, price FROM books WHERE name = ?";
        searchParam = keyword;
    } else {
        // Advanced search: partial match (case-insensitive)
        sqlquery = "SELECT name, price FROM books WHERE name LIKE ?";
        searchParam = `%${keyword}%`; // Add % wildcards for partial matching
    }
    
    // Execute the SQL query
    db.query(sqlquery, [searchParam], (err, result) => {
        if (err) {
            next(err);
        } else {
            // Render the search results using the list.ejs template
            res.render("search-result.ejs", {
                availableBooks: result,
                keyword: keyword,
                searchType: searchType
            });
        }
    });
});

router.get('/list', function(req, res, next) {
        let sqlquery = "SELECT * FROM books"; // query database to get all the books
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                next(err)
            }
            res.render("list.ejs", {availableBooks:result})
         });
    });

router.get('/bargainbooks', function(req, res, next) {
    let sqlquery = "SELECT name, price FROM books WHERE price < 20"; // query database to get books under £20
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})
    });
});

router.post('/bookadded', function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price)
    })
});


// Export the router object so index.js can access it
module.exports = router
