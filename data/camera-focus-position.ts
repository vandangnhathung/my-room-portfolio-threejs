// Camera positions for screen focus feature
export const cameraFocusPositions = {
     // Initial camera position
     initial: {
       desktop: [13.750061613249478, 10, 13.823624319788875] as [number, number, number],
       mobile: [24.340123505652443, 16.324186649232594, 25.927875821449923] as [number, number, number],
     },
     
     // Initial orbit controls target
     initialTarget: {
       desktop: [-0.8783316342959402, 3.5, -1.7424402227468443] as [number, number, number],
       mobile: [-1.3778645865330086, 3, -1.438617629177433] as [number, number, number],
     },
     
     // Screen focused positions (inside_screen_popup at [5.367, 5.918, -0.059])
     screenFocused: {
       camera: {
         // Position camera in front and slightly to the side of screen for good viewing angle
         desktop: [3.5, 6.2, 1.5] as [number, number, number],
         mobile: [2.8, 6.5, 2.2] as [number, number, number],
       },
       target: {
         // Target the actual screen position
         desktop: [5.367, 5.918, -0.059] as [number, number, number],
         mobile: [5.367, 5.918, -0.059] as [number, number, number],
       }
     },
     
     // Screen001 focused positions (inside_screen001_popup at [5.418, 5.88, 3.295])
     screen001Focused: {
       camera: {
         // Position camera for good view of the second screen
         desktop: [3.2, 6.1, 5.8] as [number, number, number],
         mobile: [2.5, 6.4, 6.2] as [number, number, number],
       },
       target: {
         // Target the actual screen001 position
         desktop: [5.418, 5.88, 3.295] as [number, number, number],
         mobile: [5.418, 5.88, 3.295] as [number, number, number],
       }
     }
   }