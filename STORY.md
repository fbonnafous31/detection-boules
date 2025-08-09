# Détection de boules de pétanque proche du cochonnet

⚙️ Ce projet a été co-construit avec l’aide d’une intelligence artificielle.

L’idée m’est venue un matin : pourquoi ne pas créer une petite application web capable de détecter la boule de pétanque la plus proche du cochonnet, simplement à partir d’une photo prise avec un smartphone ?

En moins d’une heure, sans jamais avoir réellement manipulé OpenCV.js auparavant, et sans être un expert en JavaScript côté navigateur, j’ai pu concevoir une application fonctionnelle, organisée et testable.

Si j’avais dû tout apprendre par moi-même — comprendre les bases de JavaScript, me former au traitement d’image, explorer OpenCV et sa version WebAssembly — ce projet m’aurait probablement pris plusieurs semaines.

Grâce à l’IA, que j’ai utilisée comme un véritable copilote technique, j’ai pu me concentrer sur la vision, les choix structurants, et le plaisir de construire une solution concrète à un problème du quotidien.

---

Ce projet, réalisé sans prétention, est aussi pour moi une manière de me remettre doucement dans l’univers du développement web, de reprendre la main sur les outils modernes, et de configurer un nouvel environnement (notamment VSCode) adapté à mes besoins actuels.

Il s’agit d’une expérimentation, autant technique que personnelle, mêlant curiosité, apprentissage progressif et plaisir de construire.

---

## Pourquoi une web app ?

J’ai choisi de partir sur une application web, accessible depuis n’importe quel navigateur, plutôt que de me lancer dans une application mobile native (Android/iOS). L’objectif était de garder les choses simples, légères, rapides à développer, et surtout faciles à tester et faire évoluer. En plus, une web app ne nécessite aucune installation particulière, ce qui facilite le partage avec d’autres joueurs.

---

## Les technologies choisies

Pour ce projet, je me suis appuyé sur trois piliers :

- **HTML** et **CSS** pour la structure et le style de la page, rien de très surprenant là-dedans.
- **JavaScript** (vanilla) pour la logique côté client, notamment pour gérer l’interaction avec l’utilisateur (chargement d’image, affichage, etc.).
- **OpenCV.js**, une version de la célèbre bibliothèque OpenCV compilée en WebAssembly pour être utilisable dans un navigateur, permettant de faire du traitement d’image performant directement dans la page web.

---

## Fonctionnement général

### Étape 1 : charger et afficher une photo

L’idée était d’abord de permettre à l’utilisateur de choisir une photo depuis son appareil (smartphone ou ordinateur). Pour cela, j’ai utilisé un simple champ `<input type="file">` en HTML.

En JavaScript, j’écoute l’événement `change` sur ce champ : quand une image est sélectionnée, je la charge dans un objet `Image`, puis je l’affiche sur un élément `<canvas>` HTML. Ce dernier est très utile pour manipuler des images pixel par pixel et effectuer du dessin dynamique.

### Étape 2 : préparer OpenCV.js

OpenCV.js est une bibliothèque assez lourde qui se charge de façon asynchrone dans la page. Il faut donc s’assurer qu’elle est bien prête avant d’exécuter notre code de traitement d’image. Pour cela, OpenCV fournit un callback `cv['onRuntimeInitialized']` qui est appelé lorsque tout est prêt.

### Étape 3 : détecter les boules

Avec OpenCV.js, j’ai converti l’image en niveaux de gris, puis appliqué un filtre pour lisser un peu le bruit. Ensuite, j’ai utilisé la méthode `HoughCircles` qui permet de détecter des cercles dans l’image — parfait pour nos boules et le cochonnet.

La fonction renvoie une liste de cercles détectés, chacune avec ses coordonnées et son rayon. Par convention, j’ai décidé que le premier cercle détecté est le cochonnet.

### Étape 4 : identifier la boule la plus proche

Une fois les cercles détectés, il suffit de calculer la distance entre chaque boule et le cochonnet (distance euclidienne classique), puis de déterminer laquelle est la plus proche.

Pour rendre le tout visuel, j’ai dessiné sur le canvas des cercles colorés : vert pour le cochonnet, rouge pour la boule la plus proche, bleu pour les autres.

### Étape 5 : améliorer l’expérience utilisateur

J’ai ajouté des logs dans la console pour suivre le déroulement du traitement, des messages visibles dans la page pour informer si la détection ne trouve pas assez de cercles, et une organisation claire des fichiers pour pouvoir évoluer facilement.

---

## Détails techniques

Le DOM (Document Object Model) permet d’interagir avec les éléments HTML. Par exemple, `document.getElementById('imageInput')` récupère le champ fichier.

Les événements (`addEventListener`) permettent de réagir aux actions de l’utilisateur, ici la sélection d’une image.

Le `<canvas>` est une zone dessin dans la page, manipulable avec un contexte 2D (`getContext('2d')`).

Le code utilise des fonctions callback, c’est-à-dire des morceaux de code passés à d’autres fonctions pour être appelés plus tard (notamment pour gérer le chargement de l’image et la disponibilité d’OpenCV).

Enfin, la gestion asynchrone est importante ici : il faut attendre qu’OpenCV soit chargé et que l’image soit prête avant de lancer le traitement.

---

## Conclusion

Ce petit projet est un bel exemple de comment on peut rapidement créer une application web interactive et utile avec des technologies modernes, tout en gardant une approche simple et accessible. Le fait d’utiliser OpenCV.js dans le navigateur ouvre plein de possibilités de traitement d’image sans besoin d’installer des outils lourds.

Si tu as envie d’essayer, je t’encourage à prendre ce projet comme base, à tester avec tes propres photos, et à l’améliorer à ta guise. C’est un excellent terrain de jeu pour s’initier au traitement d’image, au JavaScript, et à la création d’applications web.