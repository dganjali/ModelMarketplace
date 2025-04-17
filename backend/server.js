require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = [];
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (users.find(user => user.email === email || user.username === username)) {
            return res.status(400).json({ message: 'User already exists' });

        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = {
            id: uuidv4(),
            username,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };
        
        users.push(newUser);
        
        res.status(201).json({ 
            message: 'User registered successfully',
            user: { id: newUser.id, username, email }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/signin', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/user/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const { password, ...userDetails } = user;
    res.json(userDetails);
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});