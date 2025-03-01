const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'parking'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL ✅');
  }
});

// Add image_url column if it doesn't exist
db.query(`
  SHOW COLUMNS FROM parking LIKE 'image_url'
`, (err, results) => {
  if (err) {
    console.error('Error checking for image_url column:', err);
    return;
  }
  
  if (results.length === 0) {
    db.query(`
      ALTER TABLE parking 
      ADD COLUMN image_url VARCHAR(255)
    `, (err) => {
      if (err) {
        console.error('Error adding image_url column:', err);
      } else {
        console.log('Added image_url column to parking table');
      }
    });
  }
});

// Get all parkings
app.get('/list', (req, res) => {
  const sql = 'SELECT * FROM parking';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching parkings:', err);
      return res.status(500).json({ message: 'Error fetching parkings' });
    }
    return res.json(result);
  });
});

// Add new parking
app.post('/add', (req, res) => {
  const sql = 'INSERT INTO parking (Nom, Capacité, Tarif, image_url) VALUES (?, ?, ?, ?)';
  const values = [req.body.Nom, req.body.Capacité, req.body.Tarif, req.body.image_url];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding parking:', err);
      return res.status(500).json({ message: 'Error adding parking' });
    }
    return res.status(201).json({ message: 'Parking added successfully', id: result.insertId });
  });
});

// Update parking
app.put('/update/:id', (req, res) => {
  const sql = 'UPDATE parking SET Nom = ?, Capacité = ?, Tarif = ?, image_url = ? WHERE id = ?';
  const values = [req.body.Nom, req.body.Capacité, req.body.Tarif, req.body.image_url, req.params.id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating parking:', err);
      return res.status(500).json({ message: 'Error updating parking' });
    }
    return res.json({ message: 'Parking updated successfully' });
  });
});

// Delete parking
app.delete('/delete/:id', (req, res) => {
  const sql = 'DELETE FROM parking WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error('Error deleting parking:', err);
      return res.status(500).json({ message: 'Error deleting parking' });
    }
    return res.json({ message: 'Parking deleted successfully' });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
