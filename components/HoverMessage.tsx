// ===== FILE: components/HoverMessage.tsx =====
import React from 'react'
import { useHoverMessage } from '@/hooks/hovering/use-hover-message'

interface HoverMessageProps {
  messageState: ReturnType<typeof useHoverMessage>['messageState']
}

export const HoverMessage: React.FC<HoverMessageProps> = ({ messageState }) => {
  if (!messageState.isVisible || !messageState.meshInfo) {
    return null
  }

  const { meshInfo, position } = messageState

  const messageStyle = {
    position: 'fixed' as const,
    left: position.x + 15,
    top: position.y - 10,
    zIndex: 9999,
    pointerEvents: 'none' as const,
    transform: 'translate(0, -100%)',
    animation: 'fadeIn 0.2s ease-out',
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(0, -100%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(0, -100%) scale(1);
          }
        }
      `}</style>
      
      <div
        style={messageStyle}
        className="bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-3 rounded-lg shadow-2xl border border-gray-600 max-w-xs backdrop-blur-sm"
      >
        <div className="space-y-2">
          <div className="border-b border-gray-600 pb-2">
            <h3 className="font-semibold text-sm text-blue-300 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              {meshInfo.displayName}
            </h3>
            <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              {meshInfo.category}
            </span>
          </div>

          <p className="text-sm text-gray-200 leading-relaxed">
            {meshInfo.description}
          </p>

          {meshInfo.interactionHint && (
            <div className="pt-2 border-t border-gray-600">
              <p className="text-xs text-yellow-300 italic flex items-center gap-1">
                <span className="animate-bounce">💡</span>
                {meshInfo.interactionHint}
              </p>
            </div>
          )}
        </div>

        <div className="absolute -bottom-1 left-6 w-2 h-2 bg-gray-900 border-r border-b border-gray-600 transform rotate-45 shadow-lg"></div>
      </div>
    </>
  )
}