import { couleurMoyenne } from "./utils/utils.js";
/**
 * Détection du cochonnet dans une image prétraitée
 * @param {cv.Mat} preprocessedMat - Image prétraitée en niveaux de gris et floutée
 * @param {cv.Mat} originalMat - Image originale couleur pour analyse couleur
 * @param {CanvasRenderingContext2D} canvasCtx - Contexte canvas pour dessin
 * @param {Object} [params] - Paramètres optionnels de détection (seuils couleur, HoughCircles)
 * @returns {Object|null} Coordonnées et rayon du cochonnet détecté ou null si non détecté
 */

export function detectCochonnet(preprocessedMat, originalMat, canvasCtx, params = {}) {
  const {
    seuilJaune = { rMin: 150, rMax: 255, gMin: 150, gMax: 255, bMax: 100 },
    houghParams = {
      dp: 1,
      minDist: 20,
      param1: 100,
      param2: 20,
      minRadius: 10,
      maxRadius: 60,
    }
  } = params;

  const circles = new cv.Mat();

  cv.HoughCircles(
    preprocessedMat,
    circles,
    cv.HOUGH_GRADIENT,
    houghParams.dp,
    houghParams.minDist,
    houghParams.param1,
    houghParams.param2,
    houghParams.minRadius,
    houghParams.maxRadius
  );

  if (circles.cols === 0) {
    circles.delete();
    return null;
  }

  let cochonnet = null;

  for (let i = 0; i < circles.cols; i++) {
    const x = circles.data32F[i * 3];
    const y = circles.data32F[i * 3 + 1];
    const radius = circles.data32F[i * 3 + 2];

    const couleur = couleurMoyenne(originalMat, x, y, radius);

    if (
      couleur.r >= seuilJaune.rMin && couleur.r <= seuilJaune.rMax &&
      couleur.g >= seuilJaune.gMin && couleur.g <= seuilJaune.gMax &&
      couleur.b <= seuilJaune.bMax
    ) {
      cochonnet = { x, y, radius };
      break;
    }
  }

  circles.delete();

  if (!cochonnet) return null;

  canvasCtx.strokeStyle = "blue";
  canvasCtx.lineWidth = 10;
  canvasCtx.beginPath();
  canvasCtx.arc(cochonnet.x, cochonnet.y, cochonnet.radius + 12, 0, 2 * Math.PI);
  canvasCtx.stroke();

  return cochonnet;
}
