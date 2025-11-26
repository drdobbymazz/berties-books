// Create a new router
const express = require("express")
const router = express.Router()
const { check, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
        if (!req.session.userId ) {
            res.redirect('/users/login') // redirect to the login page
        } else { 
                next (); // move to the next middleware function
        } 
}

router.get('/', function(req, res, next) {
    res.render("index.ejs")
});

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search-result', [
    check('keyword').trim().isLength({ min: 1, max: 100 }).withMessage('Please provide a search keyword (1-100 characters)'),
    check('searchType').optional().isIn(['basic','advanced']).withMessage('Invalid search type')
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Render search form again with errors
        return res.render('search', { errors: errors.array(), formData: { keyword: req.query.keyword, searchType: req.query.searchType } })
    }
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

// Add validation middleware for bookadded
router.post('/bookadded', redirectLogin,
    [
        check('name').notEmpty().withMessage('Book name is required').trim().escape(),
        check('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number')
    ],
    function (req, res, next) {
    // saving data in database
    // validate incoming fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('addbook', { errors: errors.array(), formData: { name: req.body.name, price: req.body.price } })
    }

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
