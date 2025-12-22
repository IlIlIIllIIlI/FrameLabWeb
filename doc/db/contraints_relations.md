# Documentation de la Base de Données 

##  Valeurs (Colone, Type, Contrainte, Description) : 



###     Users (Utilisateurs) : 

Cette table stocke les informations d'identification et de profil des membres.

            id : Entier, Clé Primaire, Identifiant unique de l'utilisateur.

            email : String, Ne peut pas etre nulle et doit etre unique, Adresse email. Sert d'identifiant de connexion unique.

            password : String, Ne peut pas etre nulle, Mot de passe (haché).

            last_name: String, Ne peut pas etre nulle, Nom de famille.

            first_name : String,  Ne peut pas etre nulle, Prénom.

            is_admin : Boolean, Aucune contrainte, Administrateur (Vrai/Faux).

            inscription_date : DATETIME, Ne peut pas etre nulle, Date de création du compte.

###     Challenges (Défis) : 

Cette table définit les concours auxquels les utilisateurs peuvent participer.


            id : Entier, Clé Primaire, Identifiant unique du défi.

            theme_title : String, Ne peut pas etre nulle, Titre du thème du défi.

            theme_description : String, Ne peut pas etre nulle, Description détaillée des règles ou du but.

            required_picture_url : String, Ne peut pas etre nulle, URL de l'image source à modifier/utiliser.

            start_date : DATETIME, Ne peut pas etre nulle, Date d'ouverture des participations.

            end_date : DATETIME, Ne peut pas etre nulle, Date de clôture des participations.

            is_archived : BOOLEAN, Aucune contrainte, Indicateur si le défi est terminé/archivé.

###     entries (Participations) : 

Cette table lie un utilisateur à un défi.

            id : Entier, Clé Primaire, Identifiant unique de la participation.

            challenge_id : Entier, Clé Etrangère(vers challenges), Le défi concerné.

            user_id : Entier, Clé Etrangère(vers users),L'auteur de la participation.

            edited_picture_url : String, Ne peut pas etre nulle, URL de l'image soumise par l'utilisateur.

            submit_date : DATETIME, Ne peut pas etre nulle, Date de soumission.

            is_hidden : BOOLEAN, Aucune Contrainte, Permet de masquer.

###     comments (Commentaires) : 

Cette table permet de stocker les commentaires sur une participation spécifique.

            id : Entier, Clé Primaire, Identifiant du commentaire.

            entry_id : Entier, Clé Etrangère (vers entries), La participation commentée.

            user_id : Entier, Clé Etrangère (vers users), L'auteur du commentaire.

            content : String, Ne peut pas etre nulle, Texte du commentaire.

            date : DATETIME, Ne peut pas etre nulle, Date de publication.


###     votes : 

Système de notation multicritères.

            id : Entier, Clé Primaire, Identifiant du vote.

            user_id: Entier, Clé Etrangère (vers users), L'utilisateur qui vote.

            entry_id : Entier, Clé Etrangère (vers entries), La participation notée.
           
            creativity_rating : Float, Ne peut pas etre nulle,Note de créativité.

            technical_rating : Float, Ne peut pas etre nulle,Note technique..

            theme_respect_rating : Float, Ne peut pas etre nulle,Note de respect du thème.

            vote_date : DATETIME, Ne peut pas etre nulle,Date du vote.

###  Pour plus d'information sur les relations, vous pouvez lire le MCD/MLD






##  Contraintes : 

###     Clés Primaires et Etrangères : 

Toutes les tables possèdent une clé primaire (id) auto-incrémentée. Les relations sont assurées par des clés étrangères (REFERENCES) assurant que'on ne peut pas créer une participation pour un utilisateur ou un défi qui n'existe pas,qu'on puisse pas voter pour une participation inexistante et qu'il soit impossible de commenter une participation inexistante.
            

### Unicité 

Unicité de email dans users pour rendre impossible l'utilisation de deux comptes avec la même adresse email

Unicité du vote via UNIQUE(user_id, entry_id) dans votes pour empêcher qu'un utilisateur puisse voter deux fois sur la même participation

### Not Null

La majorité des champs sont marqués NOT NULL, ce qui force l'application à fournir des données complètes (pas de titre vide, pas de note vide, pas d'auteur manquant).

