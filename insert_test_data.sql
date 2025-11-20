# Insert data into the tables

USE berties_books;

# Insert test books
INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99), ('Red Rising', 15.50), ('Divergent', 18.75);

# Insert test user: username='gold', password='smiths'
# The password is hashed using bcrypt with 10 salt rounds
INSERT INTO users (username, first, last, email, hashedPassword) VALUES 
('gold', 'Gold', 'User', 'gold@berties-books.com', '$2b$10$Th4TnXqz1ZuT9k7flrEwNObYzwdIVWGWJ35x1pWtPKFv4BJBAFSWO');