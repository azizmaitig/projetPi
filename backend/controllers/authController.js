const express = require('express'); // Import de express
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// Route pour tester la connexion à la base de données
router.get('/test-db', (req, res) => {
  db.query('SELECT 1', (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
    }
    res.status(200).json({ message: 'Connexion réussie à la base de données' });
  });
});

// Inscription (register) : Crée un nouvel utilisateur
exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe sont requis' });
  }

  try {
    // Vérifier si l'email est déjà pris
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
          console.error("Erreur SQL :", err);
          return res.status(500).json({ error: 'Erreur serveur' });
      }
      console.log("Résultats de la requête SQL :", results);
      if (results.length === 0) {
          console.log("Utilisateur non trouvé !");
          return res.status(400).json({ error: 'Utilisateur non trouvé' });
      }
  });
  
      // Créer un mot de passe crypté
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer l'utilisateur dans la base de données
      db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur lors de l\'enregistrement' });
        }

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
      });
    ;
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Connexion (login) : Authentifie l'utilisateur et renvoie un token JWT
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe sont requis' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (results.length === 0) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    const user = results[0];

    // Comparer les mots de passe
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    // Créer un token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Connexion réussie', token, role: user.role });
  });
};
