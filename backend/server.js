const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion à la base de données MariaDB/MySQL locale (sans Docker)
const db = mysql.createPool({
    host: '127.0.0.1', // On utilise l'IP explicite pour forcer le mode réseau (TCP)
    user: 'monuser',
    password: 'monpassword',
    database: 'mabase',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Création de la table au démarrage
db.query(`CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'todo'
)`, (err) => {
    if (err) console.error("Erreur SQL lors de la création de la table :", err.message);
    else console.log('Connecté à la base de données locale et table vérifiée.');
});

// --- ROUTES DE L'API ---

// LIRE toutes les tâches
app.get('/api/tasks', (req, res) => {
    db.query("SELECT * FROM tasks", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// AJOUTER une nouvelle tâche
app.post('/api/tasks', (req, res) => {
    const { title, status } = req.body;
    const taskStatus = status || 'todo';
    
    db.query("INSERT INTO tasks (title, status) VALUES (?, ?)", [title, taskStatus], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: results.insertId, title: title, status: taskStatus });
    });
});

// MODIFIER le statut d'une tâche
app.put('/api/tasks/:id', (req, res) => {
    const { status } = req.body;
    const id = req.params.id;
    
    db.query("UPDATE tasks SET status = ? WHERE id = ?", [status, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updatedID: id, status: status });
    });
});

// SUPPRIMER une tâche
app.delete('/api/tasks/:id', (req, res) => {
    const id = req.params.id;
    
    db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deletedID: id });
    });
});

// --- DÉMARRAGE ET EXPORT ---

// Cette condition permet d'allumer le serveur normalement avec "node server.js", 
// mais empêche le port d'être bloqué lorsque Jest lance les tests en arrière-plan.
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Le BACKEND écoute sur le port ${port}`);
    });
}

// Export obligatoire pour que Supertest puisse simuler des requêtes vers l'API
module.exports = app;