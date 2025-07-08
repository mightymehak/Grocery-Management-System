const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { send } = require('process');

dotenv.config({path: './.env'});


app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

db.connect((err) =>{
    if(err){
        console.log('Error connecting to database: ' + err);
    }
    else{
        console.log('Connected to database');
    }
});

app.post('/auth/signup', async (req, res) => {
    const { name, email, password, confirm } = req.body;

    // Validate input fields
    if (!name || !email || !password || !confirm) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (password !== confirm) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the user already exists
    db.query('SELECT name, email FROM users WHERE name = ? OR email = ?', [name, email], async (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            let message = '';
            if (results.some(user => user.email === email)) {
                message = 'That email is already in use';
            }
            if (results.some(user => user.name === name)) {
                message = message ? message + ' and that username is already in use' : 'That username is already in use';
            }

            // Redirect back to the signup page with the error message
            return res.redirect(`/customerlogin.html?message=${encodeURIComponent(message)}`);
        }

        // Hash the password
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log('Hashed Password:', hashedPassword);

        // Insert the new user into the database
        const query = 'INSERT INTO users(name, email, hashed_password,password) VALUES(?, ?, ?,?)';
        db.query(query, [name, email, hashedPassword,password], (err, results) => {
            if (err) {
                console.error('Error inserting user into database:', err);
                return res.status(500).send('Internal Server Error');
            }

            console.log('New User Inserted with ID:', results.insertId);

            // Set cookies and redirect to the dashboard
            res.cookie('id', results.insertId, { maxAge: 3600000, sameSite: 'Strict' });
            res.cookie('name', name, { maxAge: 3600000, sameSite: 'Strict' });
            res.cookie('email', email, { maxAge: 3600000, sameSite: 'Strict' });
            return res.redirect('/home.html');
        });
    });
});

app.post('/auth/login',(req,res) => {
    const{email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: 'Please fill all fields'});
    }

    db.query('SELECT * FROM users WHERE email = ?', [email],async (err,results) =>{
        if(err){
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }
        if(results.length === 0){
            let message = 'Invalid email or password';
            return res.redirect(`/customerlogin.html?message=${encodeURIComponent(message)}`);
        }
        const user = results[0];
        const match = await bcrypt.compare(password,user.hashed_password);

        if(!match){
            let message = 'Incorrect password';
            return res.redirect(`/customerlogin.html?message=${encodeURIComponent(message)}`);
        }

        const token = jwt.sign(
            {id: user.id,
            email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
            }
        )

        res.cookie('token', token, {
            httpOnly: true,  
            secure: process.env.NODE_ENV === 'production',  
            maxAge: 3600000,  
            sameSite: 'Strict',  
        });

        res.cookie('id', user.id, { maxAge: 3600000, sameSite: 'Strict' });

        res.redirect(`/home.html?message=${encodeURIComponent('Logged in successfully')}`);
    });
})


app.get('/api/products', (req, res) => {
    console.log('Fetching products...'); 
    const category = req.query.category;
    const query = category 
        ? 'SELECT * FROM products WHERE category = ?' 
        : 'SELECT * FROM products';
    const params = category ? [category] : [];
    
    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error fetching products' });
        }
        console.log('Products fetched:', results.length); 
        res.json(results);
    });
});


// --- CART ROUTES ---

// Add or update cart item
app.post('/api/cart', (req, res) => {
    const userId = req.cookies.id;
    const { productId, quantity } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    db.query('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, productId], (err, results) => {
        if (err) {
            console.error('Error checking cart:', err);
            return res.status(500).json({ message: 'Error accessing cart' });
        }

        if (results.length > 0) {
            // Update quantity
            db.query(
                'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                [quantity, userId, productId],
                (err) => {
                    if (err) {
                        console.error('Error updating cart:', err);
                        return res.status(500).json({ message: 'Failed to update cart' });
                    }
                    res.json({ message: 'Cart updated' });
                }
            );
        } else {
            // Insert new cart item
            db.query(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, productId, quantity],
                (err) => {
                    if (err) {
                        console.error('Error inserting cart item:', err);
                        return res.status(500).json({ message: 'Failed to add to cart' });
                    }
                    res.json({ message: 'Item added to cart' });
                }
            );
        }
    });
});

// Get cart items
app.get('/api/cart', (req, res) => {
    const userId = req.cookies.id;

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log('User ID:', userId); // Log to check if the userId is correct

    const query = `
        SELECT ci.product_id, ci.quantity, p.name, p.price, p.unit
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching cart:', err);
            return res.status(500).json({ message: 'Error retrieving cart items' });
        }

        console.log('Cart items:', results); // Log to check if DB results are correct
        res.json(results);
    });
});


// Remove item from cart
app.delete('/api/cart/:productId', (req, res) => {
    const userId = req.cookies.id;
    const productId = req.params.productId;

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    db.query(
        'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
        [userId, productId],
        (err, result) => {
            if (err) {
                console.error('Error deleting from cart:', err);
                return res.status(500).json({ message: 'Error removing item from cart' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            res.json({ message: 'Item removed from cart' });
        }
    );
});

// Update cart item quantity on backend
app.put('/api/cart/:productId', (req, res) => {
    const userId = req.cookies.id;
    const productId = req.params.productId;
    const { quantity } = req.body;

    if (!userId || quantity < 1) {
        return res.status(400).json({ message: 'Invalid quantity or user not authenticated' });
    }

    // Update quantity of the product in the cart
    const query = `
        UPDATE cart_items
        SET quantity = ?
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(query, [quantity, userId, productId], (err, result) => {
        if (err) {
            console.error('Error updating cart item:', err);
            return res.status(500).json({ message: 'Error updating cart item' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.json({ message: 'Cart item updated' });
    });
});

// Remove item from cart
app.delete('/api/cart/:productId', (req, res) => {
    const userId = req.cookies.id;
    const productId = req.params.productId;

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const query = `
        DELETE FROM cart_items
        WHERE user_id = ? AND product_id = ?
    `;

    db.query(query, [userId, productId], (err, result) => {
        if (err) {
            console.error('Error deleting item from cart:', err);
            return res.status(500).json({ message: 'Error removing item from cart' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        res.json({ message: 'Item removed from cart' });
    });
});


app.post('/api/checkout', (req, res) => {
    const userId = req.cookies.id;

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    db.query('SELECT product_id, quantity FROM cart_items WHERE user_id = ?', [userId], (err, cartItems) => {
        if (err) {
            console.error('Error fetching cart items:', err);
            return res.status(500).json({ message: 'Error during checkout' });
        }

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const updateQueries = cartItems.map(item => {
            return new Promise((resolve, reject) => {
                db.query(
                    'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
                    [item.quantity, item.product_id, item.quantity],
                    (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        if (result.affectedRows === 0) {
                            return reject(new Error(`Insufficient stock for product ID: ${item.product_id}`));
                        }
                        resolve();
                    }
                );
            });
        });

        Promise.all(updateQueries)
            .then(() => {
                db.query('DELETE FROM cart_items WHERE user_id = ?', [userId], (err) => {
                    if (err) {
                        console.error('Error clearing cart:', err);
                        return res.status(500).json({ message: 'Error during checkout' });
                    }

                    res.json({ message: 'Checkout successful' });
                });
            })
            .catch(error => {
                console.error('Stock update error:', error.message);
                return res.status(400).json({ message: error.message });
            });
    });
});

app.get("/api/user", (req, res) => {
    const userId = req.cookies.id; // Retrieve user ID from cookie
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    db.query("SELECT name, email, password FROM users WHERE id = ?", [userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    });
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

app.get('/contact',(req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/products', (req,res) =>{
    res.sendFile(path.join(__dirname, 'public', 'products.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/customerlogin', (req,res) =>{
    res.sendFile(path.join(__dirname, 'public', 'customerlogin.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));  
});

app.use(express.static(path.join(__dirname, './public')));

app.listen(3000,() =>{
    console.log('Server is running on port 3000');
});