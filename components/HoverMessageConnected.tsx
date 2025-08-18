'use client'

import React from 'react'
import { HoverMessage } from './HoverMessage'
import { useMessageState } from '@/stores/useHoverStore'

export const HoverMessageConnected: React.FC = () => {
  const messageState = useMessageState()
  return <HoverMessage messageState={messageState} />
}


