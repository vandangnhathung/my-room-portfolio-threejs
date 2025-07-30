import { Html } from '@react-three/drei';
import React from 'react'
import { GiClick } from "react-icons/gi";

interface PointCursorProps {
     handleClick: () => void
}

const PointCursor = ({handleClick}: PointCursorProps) => {

  return (
     <Html
     transform
     wrapperClass="htmlScreen"
     distanceFactor={ 1.2 }
     position={ [ 2, 4, 0.5 ] }
     rotation-z={-Math.PI / 8}
     rotation-x={-Math.PI / 8}
     rotation-y={Math.PI / 4}
     zIndexRange={[10, 0]}
   >
     <GiClick
       size={300} 
          onClick={() => handleClick()}
       className={`text-white animate-pulse cursor-pointer`}
     />
   </Html>
  )
}

export default PointCursor