import { filterCloseCircles } from "./utils/utils.js";
/**
 * Détecte les boules sur une image prétraitée en excluant le cochonnet
 * @param {cv.Mat} src - image prétraitée en niveaux de gris (floutée, égalisée)
 * @param {cv.Mat} originalMat - image couleur originale (non utilisée ici mais peut servir pour debug/dessin)
 * @param {CanvasRenderingContext2D} canvasCtx - contexte de dessin (non utilisé ici, à enlever si inutilisé)
 * @param {Object} cochonnet - objet {x, y, radius} du cochonnet détecté
 * @returns {Array} liste des boules détectées [{x, y, radius}, ...]
 */
export function detectBoules(src, originalMat, canvasCtx, cochonnet) {
  // Validation de base de l'objet cochonnet
  if (!cochonnet || typeof cochonnet.x !== 'number' || typeof cochonnet.radius !== 'number') {
    console.warn("detectBoules : cochonnet invalide", cochonnet);
    return [];
  }

  // Conversion en niveaux de gris si besoin
  let gray = new cv.Mat();
  const channels = src.channels();
  if (channels === 4) {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  } else if (channels === 3) {
    cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);
  } else {
    src.copyTo(gray);
  }

  // Amélioration du contraste local et réduction du bruit
  cv.equalizeHist(gray, gray);
  cv.medianBlur(gray, gray, 5);

  // Détection des cercles avec HoughCircles
  let circles = new cv.Mat();
  cv.HoughCircles(
    gray,
    circles,
    cv.HOUGH_GRADIENT,
    1,
    cochonnet.radius,                        // Distance minimale entre centres
    100,                                    // param1 (Canny high threshold)
    30,                                     // param2 (accumulateur seuil pour détection)
    Math.floor(cochonnet.radius * 1.1),     // Rayon min des boules à détecter
    Math.floor(cochonnet.radius * 3.5)      // Rayon max
  );

  // Debug : afficher les cercles bruts détectés
  for (let i = 0; i < circles.cols; ++i) {
    const x = circles.data32F[i * 3];
    const y = circles.data32F[i * 3 + 1];
    const radius = circles.data32F[i * 3 + 2];
    console.log(`Cercle détecté (raw) : x=${x}, y=${y}, radius=${radius}`);
  }

  const boules = [];
  const exclusionDistance = cochonnet.radius;

  // Filtrage : on exclut les cercles trop petits ou trop proches du cochonnet
  for (let i = 0; i < circles.cols; ++i) {
    const x = circles.data32F[i * 3];
    const y = circles.data32F[i * 3 + 1];
    const radius = circles.data32F[i * 3 + 2];

    if (radius < cochonnet.radius * 1.1) {
      console.log(`Cercle rejeté (trop petit pour boule) : x=${x}, y=${y}, radius=${radius}`);
      continue;
    }

    const dx = x - cochonnet.x;
    const dy = y - cochonnet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < exclusionDistance) {
      console.log(`Cercle rejeté (proche du cochonnet) : x=${x}, y=${y}, radius=${radius}, distance=${distance}`);
      continue;
    }

    boules.push({ x, y, radius });
  }

  // Suppression des doublons : cercles trop proches
  const boulesFiltrees = filterCloseCircles(boules, cochonnet.radius);

  // Libération mémoire
  gray.delete();
  circles.delete();

  console.log("Boules détectées (après filtrage) :", boulesFiltrees.length);
  return boulesFiltrees;
}
