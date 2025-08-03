import React from 'react'

interface WoodMeshPopupContentProps {
  meshName: string
}

const WoodMeshPopupContent: React.FC<WoodMeshPopupContentProps> = ({ meshName }) => {
  const getContent = () => {
    switch (meshName) {
      case 'wood_2':
        return {
          subtitle: "You clicked on my work showcase! This is an interactive display.",
          features: [
            "Modern Web Applications",
            "React & TypeScript Projects", 
            "3D Interactive Experiences",
            "Full-Stack Development"
          ],
          status: "Portfolio: Active and Updated"
        }
      case 'wood_3':
        return {
          subtitle: "You clicked on my skills section! This showcases my technical expertise.",
          features: [
            "Frontend: React, TypeScript, Three.js",
            "Backend: Node.js, Python, Databases",
            "3D Graphics: React Three Fiber, GSAP",
            "Tools: Git, Docker, CI/CD"
          ],
          status: "Skills: Continuously Expanding"
        }
      case 'wood_4':
        return {
          subtitle: "You clicked on the about section! Learn more about my background.",
          features: [
            "Passionate Full-Stack Developer",
            "3D Web Experience Specialist",
            "Problem-Solving Mindset",
            "Continuous Learning Advocate"
          ],
          status: "Available: Open to Opportunities"
        }
      default:
        return {
          subtitle: "You clicked on an interactive element!",
          features: [
            "Interactive 3D Experience",
            "Click-Based Navigation",
            "Smooth Animations",
            "Professional Design"
          ],
          status: "System: Active and Ready"
        }
    }
  }

  const content = getContent()

  return (
    <div className="space-y-6">
      {/* Subtitle description */}
      <p className="text-gray-700 text-lg leading-relaxed">
        {content.subtitle}
      </p>

      {/* Features section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Features:</h3>
        <ul className="space-y-3">
          {content.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700 leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Status section with background similar to the image */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
        <p className="text-gray-800 font-medium">
          <span className="font-semibold">Status:</span> {content.status.split(': ')[1]}
        </p>
      </div>
    </div>
  )
}

export default WoodMeshPopupContent 