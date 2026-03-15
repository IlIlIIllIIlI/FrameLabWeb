# FrameLab

Repo a cloner/télécharger : https://github.com/IlIlIIllIIlI/FrameLabWeb

## Comment mettre en place le site web

### Back-End

- Ouvrir le dossier back-end

- Copier le contenu du fichier db/migration/001.init.sql.

- Créer une base de données
- Coller et exécuter le contenu du fichier SQL dans la base de données

- Créer un fichier .env avec les deux variables présentes dans .env.example

- Renseigner l'URL de la base de données dans la variable DATABASE_URL du fichier .env

- Insérer une chaîne de caractères aléatoire dans la variable PRIVATE_KEY

- Exécuter la commande suivante : `npm install` (les commandes doivent être exécutées dans le dossier back-end)
- Exécuter la commande suivante : `npx prisma generate`

- Pour démarrer le back-end, lancer la commande suivante : `nodemon`

### Front-End

- Ouvrir le dossier front-end.

- Créer un fichier .env avec la variable présente dans .env.example.
- Renseigner l'URL par défaut du site web (la page qui devrait être affichée si l'utilisateur entre une route qui n'existe pas, une fois le site web compilé).

- Exécuter la commande suivante : `npm install` (les commandes doivent être exécutées dans le dossier front-end).

- Pour démarrer le front-end, lancer la commande suivante : `npm run dev`.
