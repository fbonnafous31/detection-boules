import { preprocessImage } from './utils/utils.js';
import { detectCochonnet } from './detectCochonnet.js';
import { detectBoules } from './detectBoules.js';
import { findClosestBoule } from './findClosestBoule.js';

// Gestionnaire d'événement déclenché lors du choix d'une image
document.getElementById('imageInput').addEventListener('change', (e) => {
  const img = new Image();

  img.onload = () => {
    const canvas = document.getElementById('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    // Affiche l'image sur le canvas
    ctx.drawImage(img, 0, 0);

    // Lecture de l'image depuis le canvas en objet cv.Mat
    const srcMat = cv.imread(canvas);

    // Prétraitement de l'image : passage en niveaux de gris et flou
    const preprocessedMat = preprocessImage(srcMat);

    // Détection du cochonnet (balle cible)
    const cochonnet = detectCochonnet(preprocessedMat, srcMat, ctx);

    if (!cochonnet) {
      // Nettoyage mémoire et arrêt si cochonnet non détecté
      srcMat.delete();
      preprocessedMat.delete();
      console.warn("Cochonnet non détecté, arrêt du traitement.");
      return;
    }

    const boules = detectBoules(preprocessedMat, srcMat, ctx, cochonnet);
    console.log("Boules détectées :", boules);

    const closestBoule = findClosestBoule(cochonnet, boules);

    // Dessin de la boule la plus proche en vert
    if (closestBoule) {
      ctx.strokeStyle = "green";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(closestBoule.x, closestBoule.y, closestBoule.radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    const output = document.getElementById('output');
    if (closestBoule) {
      output.textContent = `Boule la plus proche : x=${closestBoule.x.toFixed(1)}, y=${closestBoule.y.toFixed(1)}, rayon=${closestBoule.radius.toFixed(1)}`;
    } else {
      output.textContent = "Aucune boule détectée.";
    }

    // Libération mémoire OpenCV
    srcMat.delete();
    preprocessedMat.delete();
  };

  // Chargement de l'image depuis le fichier sélectionné
  img.src = URL.createObjectURL(e.target.files[0]);
});
