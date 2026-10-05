# Mon Projet Full-Stack (Monorepo)

Projet d'école intégrant une architecture découplée, des tests unitaires (Jest) et un pipeline d'Intégration Continue (GitHub Actions).

## Architecture
- **/backend** : API REST avec Node.js, Express et MariaDB.
- **/frontend** : Interface utilisateur statique.

## Prérequis
- Node.js installé.
- Un serveur MariaDB/MySQL local actif (Base : `mabase`, User : `monuser`, Pass : `monpassword`).

## Commandes (dans le dossier /backend)
- **Installer** : `npm install`
- **Démarrer** : `npm start`
- **Tester (CI)** : `npm run test`
- **Linting** : `npm run lint`