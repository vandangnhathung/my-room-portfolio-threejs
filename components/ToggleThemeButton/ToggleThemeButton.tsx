import { useToggleThemeStore } from '@/stores/toggleTheme'
import React, { useRef } from 'react'

const ToggleThemeButton = () => {
  const { isDarkMode, toggleTheme } = useToggleThemeStore();
  const isClickableRef = useRef(true);
  const handleTransitionEnd = () => {
     isClickableRef.current = true;
 };

 const toggleNightMode = () => {
     if (isClickableRef.current) {
         console.log("toggleNightMode", !isDarkMode);
         toggleTheme();
         isClickableRef.current = false;
     }
 };

  return (
     <div
            className={`h-[31px] w-[62px] p-1 rounded-full transition-all duration-1000 backdrop-blur-md cursor-pointer fixed z-50 top-4 right-4 flex items-center ${
                isDarkMode ? "bg-[rgba(0,0,0,0.6)]" : "bg-[rgba(0,0,0,0.4)]"
            }`}
            onClick={toggleNightMode}
            onTransitionEnd={handleTransitionEnd}
        >
            <div
                className={`top-[4px] left-[4px] w-[23px] absolute h-[23px] rounded-full transition-all duration-1000 ${
                    isDarkMode ? "animate-switch bg-white" : "animate-reverse-switch bg-primary"
                }`}
            ></div>
        </div>
  )
}

export default ToggleThemeButton