# Procédures et Rapport de Tests

Ce document détaille la stratégie mise en place pour garantir la fiabilité, la sécurité et les performances de FrameWorkWEB

---

## 1. Procédures de Tests

Notre stratégie repose sur plusieurs niveaux de validation pour couvrir à la fois la logique métier.

### 1.1 Outils Utilisés

- **Backend (Node.js/Express) :** Jest (Framework de test) et Supertest (Simulation de requêtes HTTP).
- **Tests Manuels / API :** La fonctionalité Test de Swagger UI (Pour vérifier visuellement les réponses de l'API).

### 1.2 Types de tests implémentés

**Tests Unitaires (Modèles) :** Vérification isolée des requêtes Prisma (ex: `createUser`, `createVote`) pour s'assurer que la base de données réagit correctement aux données valides et invalides.
**Tests d'Intégration (Contrôleurs & Routes) :** Simulation de requêtes HTTP pour vérifier que les middlewares et les contrôleurs renvoient les bons resultats .

---

## 2. Rapport de Tests

Après avoir écrit tout les tests, on exécute la commande `npm test` qui va exécuter tout nos tests en montrant le coverage

L'objectif est d'avoir 100% de coverage et aucune erreur

### 2.1 Résumé de l'exécution

L'ensemble de la suite de tests automatisés s'exécute avec succès. Aucun test n'est en échec.

Extrait de Jest :

Test Suites: 18 passed, 18 total
Tests: 138 passed, 138 total
Snapshots: 0 total
Time: 27.575 s

### 2.2 Couverture de Code (Code Coverage)

L'outil Jest a généré un rapport de couverture prouvant que la quasi-totalité des lignes de code de l'API ont été éprouvées par les tests.
Extrait de Jest :
---------------------|---------|----------|---------|---------|-------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------------|---------|----------|---------|---------|-------------------
All files | 100 | 100 | 100 | 100 |  
 back-end | 100 | 100 | 100 | 100 |  
 router.js | 100 | 100 | 100 | 100 |  
 back-end/config | 100 | 100 | 100 | 100 |  
 mutler.js | 100 | 100 | 100 | 100 |  
 singleton.js | 100 | 100 | 100 | 100 |  
 back-end/controller | 100 | 100 | 100 | 100 |  
 auth.js | 100 | 100 | 100 | 100 |  
 challenges.js | 100 | 100 | 100 | 100 |  
 comments.js | 100 | 100 | 100 | 100 |  
 entries.js | 100 | 100 | 100 | 100 |  
 users.js | 100 | 100 | 100 | 100 |  
 votes.js | 100 | 100 | 100 | 100 |  
 back-end/model | 100 | 100 | 100 | 100 |  
 challenges.js | 100 | 100 | 100 | 100 |  
 comments.js | 100 | 100 | 100 | 100 |  
 entries.js | 100 | 100 | 100 | 100 |  
 users.js | 100 | 100 | 100 | 100 |  
 votes.js | 100 | 100 | 100 | 100 |  
---------------------|---------|----------|---------|---------|-------------------

On peut voir que tout est a 100%, cela veut dire que nos tests couvre toute l'API

Vous pouvez voir les tests effectué a l'intérieur de `Back-end/__test__`

---

**Conclusion :** L'application est stable. L'API empêche correctement l'insertion de données corrompues ou non autorisées.
