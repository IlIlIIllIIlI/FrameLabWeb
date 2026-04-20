# Documentation des Fonctionnalités du Projet

##  Gestion du Thème (Sombre/Clair)
L'interface possède un mode sombre et un mode clair pour optimiser le confort visuel des utilisateurs.

### Implémentation
*  Utilisation de **Tailwind CSS** via la stratégie de custom variant `dark (&:where(.dark, .dark *));`.
* Détection du thème par défaut via l'utilisation de`window.matchMedia('(prefers-color-scheme: dark)')`.
* Persistance des données grâce au stockage du choix de l'utilisateur dans le `localStorage`.

> L'utilisation de `matchMedia` permet de respecter la préférence système de l'utilisateur dès le premier chargement.`localStorage` assure que le thème choisi persiste lors des visites futures, tandis que Tailwind CSS permet une gestion du design simple et efficace.

---

## Visualisation des Profils et Statistiques
Le projet propose une interface détaillée permettant de consulter les performances et l'activité de chaque utilisateur.

### Informations et indicateurs affichés
*  Le profil utilisateur avec l'année d'inscription et le nom affiché.
* Une liste des commentaires postés, historique des participations et votes effectués pour voir l'activité globale de l'utilisateur.
* Affichage de plusieurs statistiques :
    * Note moyenne globale reçue sur l'ensemble des participations.
    * Compteur total de participations.
    * Nombre de votes reçus par la communauté.

> La centralisation de ces données permet de valoriser l'engagement des utilisateurs . Les statistiques sont calculées côté serveur pour garantir l'intégrité des statistiques et une vitesse de calcules optimisé.

---

## Modération de commentaires
Pour garantir un environnement sain, un système de modération simple a été mis en place.

### Fonctionnalité de modération
* Les modérateurs disposent des permissions nécessaires pour supprimer les commentaires inappropriés ou contraires à la charte du projet.

> L'implémentation repose sur un système de routes qui sont protégées par un middleware vérifiant si  l'utilisateur est admin, empêchant ainsi toute action non autorisée.