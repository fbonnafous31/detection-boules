/**
 * Calcule la couleur moyenne dans un carré centré sur (x, y) dans une image cv.Mat couleur
 * @param {cv.Mat} mat - image couleur cv.Mat
 * @param {number} x - coordonnée x du centre
 * @param {number} y - coordonnée y du centre
 * @param {number} radius - demi-taille du carré autour du centre
 * @returns {Object} couleur moyenne {r, g, b}
 */
export function couleurMoyenne(mat, x, y, radius) {
  const rectX = Math.max(0, Math.round(x - radius));
  const rectY = Math.max(0, Math.round(y - radius));
  const rectW = Math.min(mat.cols - rectX, Math.round(radius * 2));
  const rectH = Math.min(mat.rows - rectY, Math.round(radius * 2));

  const roi = mat.roi(new cv.Rect(rectX, rectY, rectW, rectH));
  const meanColor = cv.mean(roi);
  roi.delete();

  return { r: meanColor[0], g: meanColor[1], b: meanColor[2] };
}

/**
 * Convertit une image en niveaux de gris
 * @param {cv.Mat} src - image source (couleur ou gris)
 * @returns {cv.Mat} image en niveaux de gris (nouveau cv.Mat, à supprimer par l'appelant)
 */
export function convertToGray(src) {
  let gray = new cv.Mat();
  let channels = src.channels();

  if (channels >= 3) {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  } else {
    src.copyTo(gray);
  }

  return gray;
}

/**
 * Prépare une image en niveaux de gris pour la détection (contraste + réduction bruit)
 * @param {cv.Mat} grayMat - image en niveaux de gris (non supprimée par cette fonction)
 * @returns {cv.Mat} image traitée (nouveau cv.Mat, à supprimer par l'appelant)
 */
export function preprocessForDetection(grayMat) {
  let processed = new cv.Mat();

  cv.equalizeHist(grayMat, processed);
  cv.medianBlur(processed, processed, 5);

  return processed;
}

/**
 * Prétraitement complet à partir d'une image couleur ou gris :
 * conversion en gris puis flou gaussien
 * @param {cv.Mat} srcMat - image source (couleur ou gris)
 * @returns {cv.Mat} image prétraitée (nouveau cv.Mat, à supprimer par l'appelant)
 */
export function preprocessImage(srcMat) {
  let gray = convertToGray(srcMat);
  let blurred = new cv.Mat();

  cv.GaussianBlur(gray, blurred, new cv.Size(9, 9), 2, 2);
  gray.delete();

  return blurred;
}

/**
 * Filtre les cercles trop proches pour éviter doublons
 * @param {Array} circles - liste de cercles {x, y, radius}
 * @param {number} minDist - distance minimale entre deux cercles distincts
 * @returns {Array} liste filtrée de cercles
 */
export function filterCloseCircles(circles, minDist) {
  const filtered = [];
  for (const c of circles) {
    const isClose = filtered.some(f => Math.hypot(f.x - c.x, f.y - c.y) < minDist);
    if (!isClose) {
      filtered.push(c);
    }
  }
  return filtered;
}