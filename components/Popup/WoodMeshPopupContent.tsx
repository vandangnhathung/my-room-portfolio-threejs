import React from 'react'
import FadingTransition from '../FadingTransition/FadingTransition'

interface WoodMeshPopupContentProps {
  meshName: string
}

const WoodMeshPopupContent: React.FC<WoodMeshPopupContentProps> = ({ meshName }) => {
    switch (meshName) {
      case 'wood_2':
        return <div className="w-full h-full bg-red-500">wood 2</div>
      case 'wood_3':
        return <FadingTransition />
      case 'wood_4':
        return <div className="w-full h-full bg-red-500">wood 4</div>
      default:
        return <div className="w-full h-full bg-red-500">wood 1</div>
    }
}

export default WoodMeshPopupContent 