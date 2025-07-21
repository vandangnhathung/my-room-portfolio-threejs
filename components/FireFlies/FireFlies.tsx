import React from 'react'
import * as THREE from 'three'

const FireFlies = () => {
  const fireFliesGeometry = new THREE.BufferGeometry();
  const fireFliesCount = 30;
  const positionsArray = new Float32Array(fireFliesCount * 3);
  for (let i = 0; i < fireFliesCount; i++) {
    positionsArray[i * 3] = (Math.random() - 0.5) * 14;
    positionsArray[i * 3 + 1] = (Math.random() + 1.5) * 4;
    positionsArray[i * 3 + 2] = (Math.random() - 0.7) * 10;
  }

  fireFliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));

  // Material
  const fireFliesMaterial = new THREE.PointsMaterial({
    color: 'white',
    size: 0.5,
    sizeAttenuation: true,
  });

  return (
    <group>
      <points geometry={fireFliesGeometry} material={fireFliesMaterial}>
      </points>
    </group>
  )
}

export default FireFlies