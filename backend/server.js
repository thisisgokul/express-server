const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { check, validationResult } = require('express-validator');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

const users = [];

app.post(
  '/signup',
  [
    check('name').notEmpty().withMessage('Name is required.'),
    check('email').isEmail().withMessage('Please provide a valid email.'),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const newUser = { name, email, password };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully.' });
  }
);


app.post(
  '/login',
  [
    check('email').isEmail().withMessage('Please provide a valid email.'),
    check('password').notEmpty().withMessage('Password is required.'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    res.status(200).json({ message: 'Login successful.' });
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
