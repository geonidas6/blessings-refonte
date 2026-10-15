# Refontes Blessings

Deux sites statiques HTML/CSS/JavaScript, servis par Nginx derrière le Traefik existant (réseau `proxy_net`, entrée `websecure`, résolveur `myresolver`).

- Cleaning : https://blessing.it-sefako.com — trois accueils via `propositions.html`.
- Couture : https://couture.it-sefako.com — deux accueils via `propositions.html`.

Déploiement : `docker compose up -d --build` dans ce dossier. Aucun changement du Traefik global ni des sites existants.

Les formulaires valident les champs et préparent une demande WhatsApp vers le numéro conservé. L’utilisateur doit ensuite l’envoyer dans WhatsApp. Aucun stockage ni envoi serveur, aucune fausse confirmation. Un contact téléphonique est également disponible.

Les nouvelles prestations professionnelles sont des propositions à valider avec la cliente, notamment les protocoles du secteur médical et les zones d’intervention. Les tarifs à domicile fournis pour la proposition sont de 11,40 €, 10,60 € et 10 € par heure selon la région. Le tarif bureaux de 32 € HTVA/heure est fictif, expressément demandé pour la démonstration et identifié comme tel sur chaque affichage. Le tarif réel nécessite un devis. Aucun témoignage, certification ou horaire d’ouverture non confirmé. Les disponibilités demandées vont du mardi au samedi pour l’inscription et du mardi au vendredi pour les candidatures.

Un tiroir « Thèmes » sur les deux sites permet de choisir la palette actuelle ou une palette inspirée du logo. La préférence est conservée dans localStorage, indépendamment sur chaque domaine. Le tiroir utilise un dialogue modal natif (focus, touche Échap) et respecte la réduction des animations.

Les pages de démonstration sont en `noindex`. Avant la mise en production sur les domaines officiels, valider les services, les mentions légales complètes, les photographies d’illustration et le traitement des demandes avec la cliente. Toutes les photographies utilisées sont nouvellement générées avec Imagegen ; seuls les logos proviennent des sites existants. Les prompts et chemins sont documentés dans `IMAGE-PROMPTS.md`.

Le slider de l’accueil Cleaning possède trois diapositives, transitions douces, commandes précédent/suivant, sélection directe, pause et balayage tactile. Il s’arrête au survol, au focus et lorsque l’onglet est masqué ; le défilement automatique est désactivé si le visiteur préfère réduire les animations.

Les pages HTML sont autonomes, le CSS et le JS sont dans le dossier `assets` de chaque site. Aucune compilation ni framework nécessaire. L’ancienne démo `/opt/blessings-demo` est conservée.
