const express = require('express');
const cors = require('cors'); // Pour éviter les problèmes CORS
const app = express();
const mysql = require("mysql");

app.use(cors()); // Autoriser toutes les origines
app.use(express.json()); // Permet de traiter les JSON envoyés par le front

const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Remplace par ton utilisateur MySQL
    password: "", // Remplace par ton mot de passe
    database: "parking"
});

db.connect(err => {
  if (err) {
      console.error("Erreur de connexion MySQL :", err);
  } else {
      console.log("Connecté à MySQL ✅");
  }
});

app.post('/login', (req, res) => {
  const sql = "SELECT * FROM users WHERE email=? AND password=?";

  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json({ message: "Error" }); // Gérer les erreurs
    }

    if (data.length > 0) {
      return res.status(200).json({ message: "Login successful!" }); // Réponse en cas de succès
    } else {
      return res.status(401).json({ message: "Invalid credentials" }); // Réponse en cas d'échec
    }
  });
});


app.get('/list', (req, res) => {
  const sql = "SELECT * FROM parking ";

  db.query(sql, (err, result) => {
    if (err) {
      return res.json({ message: "Error" }); // Gérer les erreurs
    }
    return res.json(result);
  });
});

// ajouter parking 
app.post('/add', (req, res) => {
  const sql = "INSERT INTO parking (Nom, Capacité, Tarif, image_url, Lieu) VALUES (?, ?, ?, ?, ?)";

  console.log("Données reçues :", req.body); // Vérifie les données envoyées par le frontend

  db.query(sql, [req.body.Nom, req.body.Capacité, req.body.Tarif, req.body.image_url ,req.body.Lieu], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion :", err); // Log l'erreur pour debug
      return res.status(500).json({ message: "Erreur lors de l'ajout du parking." });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Ajouté avec succès !" });
    } else {
      return res.status(400).json({ message: "Échec de l'ajout." });
    }
  });
});

// Editer parking 
app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { Nom, Capacité, Tarif, image_url } = req.body;
  const sql = "UPDATE parking SET Nom = ?, Capacité = ?, Tarif = ?, image_url = ?, Lieu=? WHERE id = ?";

  db.query(sql, [Nom, Capacité, Tarif, image_url, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating parking" });
    }
    return res.status(200).json({ message: "Parking updated successfully" });
  });
});
app.get('/get/:id', (req, res) => {
  const { id } = req.params;
  // Rechercher dans la base de données avec l'id
  // Par exemple : SELECT * FROM parking WHERE id = id;
  db.query("SELECT * FROM parking WHERE id = ?", [id], (err, data) => {
      if (err) {
          return res.status(500).json({ message: 'Error fetching data' });
      }
      res.json(data[0]);  // Assurez-vous de renvoyer un objet et non un tableau
  });
});

// supprimer parking

app.delete('/delete/:id', (req, res) => {
  const sql = "DELETE FROM parking WHERE id= ?" ;
  const id = req.params.id; 
  db.query(sql, [id], (err,result)=> {
    if (err ) return res.json({Message: "Error inside server "}) ; 
    return res.json (result);
  })

});

// senEmail

app.post('/request-password-reset', (req, res) => {
  const { email } = req.body;

  // Vérifie que l'email est valide
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Logique pour générer un lien de réinitialisation
  const resetLink = `http://localhost:3000/reset-password?email=${email}&token=unique-token`;

  // Envoie de l'email de réinitialisation
  sendResetPasswordEmail(email, resetLink);

  res.status(200).json({ message: 'Reset link has been sent to your email' });
});
// Lancer le serveur sur le port 5000
const PORT = 3006;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// Simuler des données de parking
let parkingData = {
  totalPlaces: 100,
  occupied: 45,
  reserved: 10
};

// Endpoint pour récupérer l'état du parking
app.get('/api/parking', (req, res) => {
  res.json(parkingData);
});

// Endpoint pour mettre à jour l'état du parking
app.post('/api/parking/update', (req, res) => {
  const { occupied, reserved } = req.body;
  parkingData = { ...parkingData, occupied, reserved };
  res.json(parkingData);
});
app.get('/test-db', (req, res) => {
  db.query("SELECT 1", (err, result) => {
      if (err) {
          return res.status(500).json({ message: "Erreur de connexion MySQL", error: err });
      }
      return res.json({ message: "Connexion MySQL OK ✅" });
  });
});
// Get all parking spots
app.get('/parking-spots', (req, res) => {
  const sql = 'SELECT * FROM parking_spots';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching parking spots:', err);
      return res.status(500).json({ message: 'Error fetching parking spots' });
    }
    return res.json(result);
  });
});
// Add new parking spot
app.post('/parking-spots', (req, res) => {
  const sql = 'INSERT INTO parking_spots (id, number, status, floor, section, x, y, width, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [
    req.body.id,
    req.body.number,
    req.body.status,
    req.body.floor,
    req.body.section,
    req.body.x,
    req.body.y,
    req.body.width || 80,
    req.body.height || 120
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error adding parking spot:', err);
      return res.status(500).json({ message: 'Error adding parking spot', error: err.message });
    }
    return res.status(201).json(req.body);
  });
});
app.put('/parking-spots/:id', (req, res) => {
  const sql = 'UPDATE parking_spots SET number = ?, status = ?, floor = ?, section = ?, x = ?, y = ?, width = ?, height = ? WHERE id = ?';
  const values = [
    req.body.number,
    req.body.status,
    req.body.floor,
    req.body.section,
    req.body.x,
    req.body.y,
    req.body.width || 80,
    req.body.height || 120,
    req.params.id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating parking spot:', err);
      return res.status(500).json({ message: 'Error updating parking spot', error: err.message });
    }
    return res.json(req.body);
  });
});
app.delete('/parking-spots/:id', (req, res) => {
  const sql = 'DELETE FROM parking_spots WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error('Error deleting parking spot:', err);
      return res.status(500).json({ message: 'Error deleting parking spot' });
    }
    return res.json({ message: 'Parking spot deleted successfully' });
  });
});
app.get('/clients-high-reservations', (req, res) => {
  const sql = `
    SELECT c.id, c.nom, c.email, COUNT(r.id) AS nombre_reservations
    FROM ancienne_reservation r
    JOIN client c ON r.client_id = c.id
    WHERE r.statut = 'payé'
    GROUP BY c.id
    HAVING COUNT(r.id) > 4
    LIMIT 0, 25
  `;
  
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des clients : ", err);  // Afficher l'erreur
      return res.status(500).json({ error: "Erreur serveur" });
    }
  
    console.log(result);  // Afficher le résultat de la requête SQL
  
    if (result.length === 0) {
      return res.status(404).json({ message: "Aucun client n'a plus de 4 réservations payées." });
    }
  
    res.json(result);  // Renvoie les clients ayant plus de 4 réservations payées
  });
});
// Route pour obtenir les informations des places de parking
app.get('/places', (req, res) => {
  const sql = "SELECT * FROM place"; // Récupère toutes les places
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send({ error: 'Erreur de récupération des places' });
    }
    res.json(results);
  });
});
// Récupérer les réservations pour une place
app.get('/reservation/:numeroPlace', (req, res) => {
  const numeroPlace = req.params.numeroPlace;

  const query = `
    SELECT r.*, c.nom AS client_nom, c.email AS client_email, p.numero AS place_numero, r.date_reservation, r.statut
    FROM reservation r
    JOIN client c ON r.client_id = c.id
    JOIN place p ON r.place_id = p.id
    WHERE p.numero = ?`;

  db.query(query, [numeroPlace], (err, result) => {
    if (err) {
      console.error("Erreur lors de la récupération des détails : ", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Aucune réservation trouvée pour cette place." });
    }

    res.json(result[0]);
  });
});
app.get("/reservation/place/:numero", (req, res) => {
  const placeNumero = req.params.numero;
  const sql = `
    SELECT r.*, c.nom AS client_nom, c.email AS client_email, 
           p.numero AS place_numero, r.date_reservation, r.statut
    FROM reservation r
    JOIN client c ON r.client_id = c.id
    JOIN place p ON r.place_id = p.id
    WHERE p.numero = ?;
  `;

  db.query(sql, [placeNumero], (err, result) => {
    if (err) {
      console.error("Erreur SQL :", err);
      res.status(500).json({ message: "Erreur serveur" });
    } else {
      if (result.length > 0) {
        res.json(result[0]); // Renvoie la réservation trouvée
      } else {
        res.json({ message: "Aucune réservation trouvée pour cette place" });
      }
    }
  });
});
// Récupérer toutes les réclamations

  app.get('/reclamations', (req, res) => {
    const sql = "SELECT * FROM reclamation ";
  
    db.query(sql, (err, result) => {
      if (err) {
        return res.json({ message: "Error" }); // Gérer les erreurs
      }
      return res.json(result);
    });
  });

// Ajouter une réclamation
app.post('/reclamations/add', (req, res) => {
  const { statut, description } = req.body;
  const dateheure = new Date().toISOString().slice(0, 19).replace('T', ' '); // Pour obtenir la date et l'heure au format MySQL

  const sql = "INSERT INTO reclamation (dateheure, statut, description) VALUES (?, ?, ?)";
  
  db.query(sql, [dateheure, statut, description], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout de la réclamation :", err);
      return res.status(500).json({ message: "Erreur lors de l'ajout de la réclamation" });
    }
    
    res.status(201).json({ message: "Réclamation ajoutée avec succès" });
  });
});


