// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10


router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password
    // saving data in database
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) return next(err)

        // Prepare SQL to insert the new user (username, first, last, email, hashedPassword)
        const sql = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?,?,?,?,?)"
        const params = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword]

        // execute sql query
        db.query(sql, params, (err, result) => {
            if (err) {
                next(err)
            } else {
                let resultMsg = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email + '.\n'
                resultMsg += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
                res.send(resultMsg);
            }
        })
    })
}); 

router.get('/list', function(req, res, next) {
    // Query to get all users (exclude hashedPassword for security)
    const sql = "SELECT id, username, first, last, email FROM users"
    
    db.query(sql, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.render('users-list.ejs', {userList: result})
        }
    })
});

router.get('/login', function(req, res, next) {
    res.render('login.ejs')
});

router.post('/loggedin', function(req, res, next) {
    const username = req.body.username
    const plainPassword = req.body.password
    
    // Query the database to find the user by username
    const sql = "SELECT id, username, first, last, hashedPassword FROM users WHERE username = ?"
    
    db.query(sql, [username], (err, result) => {
        if (err) {
            return next(err)
        }
        
        // Check if user exists
        if (result.length === 0) {
            // Log failed login attempt (user not found)
            const auditSql = "INSERT INTO login_audit (username, status, reason) VALUES (?,?,?)"
            db.query(auditSql, [username, 'failed', 'Username not found'], (auditErr) => {
                if (auditErr) console.error('Audit log error:', auditErr)
            })
            return res.send('Login failed! Username not found.')
        }
        
        // User found, now compare the plain password with the hashed password
        const user = result[0]
        bcrypt.compare(plainPassword, user.hashedPassword, function(err, isMatch) {
            if (err) {
                return next(err)
            }
            
            if (isMatch) {
                // Password matches - login successful
                // Log successful login attempt
                const auditSql = "INSERT INTO login_audit (username, status, reason) VALUES (?,?,?)"
                db.query(auditSql, [username, 'success', 'Login successful'], (auditErr) => {
                    if (auditErr) console.error('Audit log error:', auditErr)
                })
                res.send('Login successful! Welcome back, ' + user.first + ' ' + user.last + '!')
            } else {
                // Password does not match - login failed
                // Log failed login attempt (incorrect password)
                const auditSql = "INSERT INTO login_audit (username, status, reason) VALUES (?,?,?)"
                db.query(auditSql, [username, 'failed', 'Incorrect password'], (auditErr) => {
                    if (auditErr) console.error('Audit log error:', auditErr)
                })
                res.send('Login failed! Incorrect password.')
            }
        })
    })
});

router.get('/audit', function(req, res, next) {
    // Query to get all login audit records ordered by most recent first
    const sql = "SELECT id, username, login_time, status, reason FROM login_audit ORDER BY login_time DESC"
    
    db.query(sql, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.render('audit.ejs', {auditLog: result})
        }
    })
});

// Export the router object so index.js can access it
module.exports = router
