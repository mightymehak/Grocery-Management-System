const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');


dotenv.config({path: './.env'});

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME
});

db.connect((err) =>{
    if(err){
        console.log('Error connecting to database: ' + err);
    }
    else{
        console.log('Connected to database');
    }
});



app.post('/admin/login', (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    db.query('SELECT * FROM admin WHERE id = ?', [id], async (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            const message = 'Invalid ID';
            return res.redirect(`/adminlogin.html?message=${encodeURIComponent(message)}`);
        }

        const user = results[0];

        // Now check if password matches
        if (user.password !== password) {
            const message = 'Invalid password';
            return res.redirect(`/adminlogin.html?message=${encodeURIComponent(message)}`);
        }

        // If ID and Password both correct, generate token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // 1 hour
            sameSite: 'Strict',
        });

        res.cookie('id', user.id, { 
            maxAge: 3600000,
            sameSite: 'Strict',
        });

        const message = 'Logged in successfully';
        return res.redirect(`/dashboard.html?message=${encodeURIComponent(message)}`);
    });
});


app.post('/api/customers', (req, res) => {
    const { name, phone } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ message: 'Name and phone are required' });
    }

    const sql = 'INSERT INTO customers (name, phone_number) VALUES (?, ?)';
    db.query(sql, [name, phone], (err, result) => {
        if (err) {
            console.error('Error inserting customer:', err);
            return res.status(500).json({ message: 'Failed to create customer' });
        }

        res.json({ customerId: result.insertId });
    });
});



app.post('/api/cart', (req, res) => {
    const { customerId, productId, quantity } = req.body;

    if (!customerId || !productId || !quantity) {
        return res.status(400).json({ message: 'Customer ID, Product ID, and Quantity are required' });
    }

    // First, check if the item already exists in the cart
    const checkQuery = 'SELECT * FROM cart_items WHERE cust_id = ? AND product_id = ?';
    db.query(checkQuery, [customerId, productId], (err, results) => {
        if (err) {
            console.error('Error checking cart item:', err);
            return res.status(500).json({ message: 'Failed to check cart' });
        }

        if (results.length > 0) {
            // If item exists, update quantity
            const updateQuery = 'UPDATE cart_items SET quantity = quantity + ? WHERE cust_id = ? AND product_id = ?';
            db.query(updateQuery, [quantity, customerId, productId], (err, updateResult) => {
                if (err) {
                    console.error('Error updating cart item:', err);
                    return res.status(500).json({ message: 'Failed to update cart item' });
                }
                res.status(200).json({ message: 'Cart item quantity updated' });
            });
        } else {
            // If item does not exist, insert new record
            const insertQuery = 'INSERT INTO cart_items (cust_id, product_id, quantity) VALUES (?, ?, ?)';
            db.query(insertQuery, [customerId, productId, quantity], (err, insertResult) => {
                if (err) {
                    console.error('Error inserting cart item:', err);
                    return res.status(500).json({ message: 'Failed to add item to cart' });
                }
                res.status(201).json({ cartItemId: insertResult.insertId, message: 'Cart item added' });
            });
        }
    });
});

// Add this endpoint with your other routes in server.js

app.patch('/api/products/:productId/stock', (req, res) => {
    const productId = req.params.productId;
    const { stockChange } = req.body;

    if (!productId || stockChange === undefined) {
        return res.status(400).json({ message: 'Product ID and stockChange are required' });
    }

    // First get current stock
    db.query('SELECT stock FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product stock:', err);
            return res.status(500).json({ message: 'Failed to fetch product stock' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const currentStock = results[0].stock;
        const newStock = currentStock + stockChange;

        // Prevent stock from going negative
        if (newStock < 0) {
            return res.status(400).json({ 
                message: 'Insufficient stock',
                currentStock: currentStock,
                requestedChange: stockChange
            });
        }

        // Update the stock
        db.query('UPDATE products SET stock = ? WHERE id = ?', [newStock, productId], (err, updateResult) => {
            if (err) {
                console.error('Error updating product stock:', err);
                return res.status(500).json({ message: 'Failed to update product stock' });
            }

            // Return the updated product
            db.query('SELECT * FROM products WHERE id = ?', [productId], (err, productResults) => {
                if (err) {
                    console.error('Error fetching updated product:', err);
                    return res.status(500).json({ message: 'Failed to fetch updated product' });
                }

                res.status(200).json({ 
                    message: 'Stock updated successfully',
                    product: productResults[0]
                });
            });
        });
    });
});

app.delete('/api/cart/:customerId/:productId', (req, res) => {
    const { customerId, productId } = req.params;

    if (!customerId || !productId) {
        return res.status(400).json({ message: 'Customer ID and Product ID are required' });
    }

    const deleteQuery = 'DELETE FROM cart_items WHERE cust_id = ? AND product_id = ?';
    db.query(deleteQuery, [customerId, productId], (err, result) => {
        if (err) {
            console.error('Error deleting cart item:', err);
            return res.status(500).json({ message: 'Failed to delete cart item' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.status(200).json({ message: 'Cart item deleted successfully' });
    });
});




app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Failed to fetch products" });
        }
        res.json(results);
    });
});

app.post('/api/orders/complete', (req, res) => {
    const { customerId, items, total } = req.body;

    if (!customerId || !items || !total) {
        return res.status(400).json({ message: 'Customer ID, items, and total are required' });
    }

    // Start transaction
    db.beginTransaction(err => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ message: 'Failed to start transaction' });
        }

        // 1. Get customer details
        db.query('SELECT * FROM customers WHERE id = ?', [customerId], (err, customerResults) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Customer fetch error:', err);
                    res.status(500).json({ message: 'Failed to fetch customer' });
                });
            }

            if (customerResults.length === 0) {
                return db.rollback(() => {
                    res.status(404).json({ message: 'Customer not found' });
                });
            }

            const customer = customerResults[0];
            const orderDate = new Date();

            // 2. Create order record
            const insertOrderQuery = `
                INSERT INTO orders ( cust_id, total_amount, order_date)
                VALUES (?, ?, ?)
            `;
            db.query(insertOrderQuery, 
                [ customer.id, total, orderDate], 
                (err, orderResult) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Order insert error:', err);
                            res.status(500).json({ message: 'Failed to create order' });
                        });
                    }

                    const orderId = orderResult.insertId;
                    const orderItems = items.map(item => [
                        orderId, 
                        item.product_id, 
                        item.quantity, 
                        item.price
                    ]);

                            // 4. Update product stock
                            const stockUpdates = items.map(item => {
                                return new Promise((resolve, reject) => {
                                    db.query(
                                        'UPDATE products SET stock = stock - ? WHERE id = ?',
                                        [item.quantity, item.product_id],
                                        (err) => {
                                            if (err) reject(err);
                                            else resolve();
                                        }
                                    );
                                });
                            });

                            Promise.all(stockUpdates)
                                .then(() => {
                                    // 5. Clear cart
                                    db.query('DELETE FROM cart_items WHERE cust_id = ?', [customerId], (err) => {
                                        if (err) {
                                            return db.rollback(() => {
                                                console.error('Cart clear error:', err);
                                                res.status(500).json({ message: 'Failed to clear cart' });
                                            });
                                        }

                                        // Commit transaction if all successful
                                        db.commit(err => {
                                            if (err) {
                                                return db.rollback(() => {
                                                    console.error('Commit error:', err);
                                                    res.status(500).json({ message: 'Failed to complete order' });
                                                });
                                            }
                                            res.json({ 
                                                success: true,
                                                orderId: orderId
                                            });
                                        });
                                    });
                                })
                                .catch(error => {
                                    db.rollback(() => {
                                        console.error('Stock update error:', error);
                                        res.status(500).json({ message: 'Failed to update product stock' });
                                    });
                                });
                        }
                    );
                }
            );
        });
    });


app.get('/dashboard',(req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
})

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