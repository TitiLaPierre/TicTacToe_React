# Comment mettre en place la partie frontend du site

## En local

- Dans le répertoire `~\frontend\`, exécuter la commande `npm start` pour lancer le serveur de développement.

## En production

- Commencer par exclure le fichier `.env.local` du répertoire `~\frontend\`.
- Dans le répertoire `~\frontend\`, exécuter la commande `npm run build` pour créer le build de production.
- Envoyer le contenu du répertoire `~\frontend\build\` sur le serveur web.
- Redémarrer le serveur web.

# En cas de problème de connexion avec le backend

## En local

- Le fichier `.env.local` doit être présent dans le répertoire `~\frontend\`. Il contient : `REACT_APP_ENVIRONMENT=local`.
- Revérifier que le backend est bien lancé.

## En production

- Le fichier `.env.local` doit être absent du build de production. Le refaire si besoin.
- Revérifier que le backend est bien lancé.
- Redémarrer le backend.