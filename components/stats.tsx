import React from 'react'
import StatsJS from 'stats.js'

const Stats = () => {
    
    const stats = new StatsJS()
    stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom)

  return (
    <div>Stats</div>
  )
}

export default Stats