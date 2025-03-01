const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController'); // Assure-toi d'avoir la fonction login dans le contrôleur

router.post('/login', login); // Cette ligne enregistre la route POST /login


module.exports = router;
