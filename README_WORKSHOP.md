# 🎓 Workshop HttpClient - Guide de Démarrage Rapide

## ⚡ Démarrage Rapide

### 1. Installer json-server (si pas déjà fait)
```bash
npm i --global json-server
```

### 2. Démarrer le backend JSON Server

**Option A - Script npm (recommandé)** :
```bash
npm run backend
```

**Option B - Commande manuelle** :
```bash
cd backend/data
json-server --watch db.json
```

Le serveur démarre sur `http://localhost:3000`

### 3. Démarrer l'application Angular

Dans un **nouveau terminal** :
```bash
npm start
```

L'application démarre sur `http://localhost:4200`

## ✅ Vérification

1. **Backend** : Ouvrir `http://localhost:3000/events` dans le navigateur
   - Vous devriez voir la liste des événements en JSON

2. **Application** : Ouvrir `http://localhost:4200`
   - Aller sur la page "Événements" (`/list`)
   - Les événements devraient s'afficher depuis le backend

3. **DevTools** : Ouvrir F12 → Onglet Network
   - Vérifier les requêtes vers `localhost:3000/events`

## 📚 Documentation Complète

Voir `WORKSHOP_GUIDE.md` pour la documentation détaillée du workshop.

## 🐛 Dépannage

### Le backend ne démarre pas
- Vérifier que json-server est installé : `json-server --version`
- Vérifier que le fichier `backend/data/db.json` existe

### L'application ne charge pas les données
- Vérifier que le backend est démarré sur le port 3000
- Vérifier la console du navigateur pour les erreurs
- Vérifier l'onglet Network dans DevTools

### Erreur CORS
- json-server gère CORS automatiquement
- Si problème, vérifier que vous utilisez bien `http://localhost:3000`

