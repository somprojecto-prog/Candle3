import * as THREE from "three";

/**
 * UVs por projeção de caixa: eixo dominante da normal → plano (z,y), (x,y) ou (x,z); uv = pos × texelsPerUnit.
 * Espera a geometria não indexada que sai de toCreasedNormals (um normal por vértice). O GLB não tem UVs.
 * Corre uma vez por geometria (no cache de productParts), nunca por frame.
 */
export function boxProjectUV(geometry: THREE.BufferGeometry, texelsPerUnit = 0.8): void {
  const pos = geometry.getAttribute("position");
  const nor = geometry.getAttribute("normal");
  if (!pos || !nor) return;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const ax = Math.abs(nor.getX(i));
    const ay = Math.abs(nor.getY(i));
    const az = Math.abs(nor.getZ(i));
    let u: number;
    let v: number;
    if (ax >= ay && ax >= az) {
      u = pos.getZ(i);
      v = pos.getY(i);
    } else if (ay >= az) {
      u = pos.getX(i);
      v = pos.getZ(i);
    } else {
      u = pos.getX(i);
      v = pos.getY(i);
    }
    uv[i * 2] = u * texelsPerUnit;
    uv[i * 2 + 1] = v * texelsPerUnit;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
}

/** Caixa para os placeholders, com UVs projetados (o grão não estica). O chamador faz dispose. */
export function createProjectedBox(w: number, h: number, d: number, texelsPerUnit = 0.8): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(w, h, d).toNonIndexed();
  boxProjectUV(g, texelsPerUnit);
  return g;
}