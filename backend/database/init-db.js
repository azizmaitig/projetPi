const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});

// First, create the database if it doesn't exist
connection.query('CREATE DATABASE IF NOT EXISTS parking', (err) => {
  if (err) {
    console.error('Error creating database:', err);
    return;
  }
  console.log('Database created or already exists');
  
  // Switch to using the parking database
  connection.changeUser({ database: 'parking' }, (err) => {
    if (err) {
      console.error('Error switching to database:', err);
      return;
    }

    // Read and execute the SQL file
    const sqlFile = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Split the SQL file into separate statements
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    // Execute each statement separately
    statements.forEach(statement => {
      if (statement.trim()) {
        connection.query(statement, (err) => {
          if (err) {
            console.error('Error executing statement:', err);
            console.error('Statement:', statement);
          }
        });
      }
    });

    console.log('Database initialized successfully');
    connection.end();
  });
});