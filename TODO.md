### Partie publique (site pour les candidats)
1. **Page de liste des offres d'emploi** :
   - Afficher toutes les offres d'emploi disponibles.
   - Ajouter des filtres pour rechercher ou trier les offres (si nécessaire).
   - Inclure un lien pour postuler à une offre.

2. **Page de détail d'une offre d'emploi** :
   - Afficher les détails de l'offre (titre, description, logo, bullet points, etc.).
   - Bouton pour postuler à l'offre.

3. **Formulaire de candidature** :
   - Afficher les questions associées à l'offre.
   - Permettre au candidat de répondre aux questions.
   - Ajouter une validation des champs.
   - Envoyer les réponses au back-end.
   - Afficher un message de confirmation après soumission.

4. **Lien pour suppression des données** :
   - Créer une page accessible via un lien envoyé par e-mail.
   - Permettre au candidat de confirmer la suppression de ses données.

---

### Partie back-office
1. **Authentification et gestion des utilisateurs** :
   - Implémenter le social login (Google, Facebook, etc.).
   - Créer une page pour accepter les invitations par e-mail.
   - Ajouter une interface pour désactiver un utilisateur (avec confirmation).

2. **Gestion des offres d'emploi** :
   - Page pour créer/modifier une offre d'emploi :
     - Formulaire avec des champs pour le titre, texte, bullet points, logo, etc.
     - Option pour publier ou non l'offre.
   - Page pour lister toutes les offres d'emploi (avec statut publié/non publié).

3. **Gestion des questions** :
   - Interface pour ajouter des questions à une offre (création à la volée ou sélection depuis la bibliothèque).
   - Page pour gérer la bibliothèque de questions (ajouter, modifier, supprimer des questions).

4. **Gestion des candidatures** :
   - Page pour lister toutes les candidatures avec filtres :
     - Non closes.
     - Assignées à l'utilisateur connecté.
     - Non assignées.
     - Avec un ou plusieurs tags.
   - Page de détail d'une candidature :
     - Afficher les réponses du candidat.
     - Ajouter des commentaires.
     - Ajouter des tags.
     - Choisir une action (réponse négative, 2e revue, réponse positive, clore la candidature).
     - Assigner la candidature à un autre utilisateur.

5. **Journal des actions** :
   - Page pour consulter le journal des actions des utilisateurs du back-office.
   - Page pour consulter le journal des suppressions de candidatures par les candidats.

---

### Composants réutilisables
1. **Composants UI** :
   - Boutons, modales, formulaires, notifications, etc.
   - Tableaux pour afficher les listes (offres, candidatures, utilisateurs).

2. **Gestion des états** :
   - Utiliser un gestionnaire d'état global (ex. Redux, Zustand, ou Context API) pour gérer les données partagées (utilisateur connecté, candidatures, offres, etc.).

3. **Navigation** :
   - Configurer un routeur (ex. React Router) pour gérer les différentes pages et routes.

---

### Intégration avec le back-end
1. **API** :
   - Configurer les appels API pour récupérer et envoyer les données (offres, candidatures, utilisateurs, etc.).
   - Gérer les erreurs et afficher des messages appropriés.

2. **Authentification** :
   - Gérer les tokens d'accès pour le social login et les invitations.

---

### Tests
1. **Tests unitaires** :
   - Tester les composants individuels (formulaires, tableaux, etc.).

2. **Tests d'intégration** :
   - Vérifier les interactions entre les composants et les appels API.

3. **Tests end-to-end** :
   - Simuler les parcours utilisateurs (ex. postuler à une offre, gérer une candidature).

---

### Outils et technologies recommandés
- **Framework** : React, Vue.js ou Angular.
- **UI Library** : Material-UI, TailwindCSS, ou Bootstrap.
- **Gestion d'état** : Redux, Zustand, ou Context API.
- **Tests** : Jest, React Testing Library, Cypress.
- **Routing** : React Router (ou équivalent pour d'autres frameworks).

Cela devrait te donner une vue d'ensemble des tâches à réaliser pour la partie front-end.
