/**
 * Trouve la boule la plus proche du cochonnet
 * @param {Object} cochonnet - objet {x, y} du cochonnet
 * @param {Array} boules - liste des boules détectées [{x, y, radius}, ...]
 * @returns {Object|null} boule la plus proche ou null si aucune boule
 */
export function findClosestBoule(cochonnet, boules) {
  // Validation simple des paramètres
  if (!cochonnet || !Array.isArray(boules) || boules.length === 0) return null;

  let closest = null;
  let minDist = Infinity;

  // Parcours des boules pour trouver la plus proche du cochonnet
  for (const boule of boules) {
    const dist = Math.hypot(boule.x - cochonnet.x, boule.y - cochonnet.y);
    if (dist < minDist) {
      closest = boule;
      minDist = dist;
    }
  }

  console.log("Boule la plus proche détectée :", closest);
  return closest;
}
