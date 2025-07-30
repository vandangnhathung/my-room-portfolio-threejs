// Camera positions for screen focus feature
export const cameraFocusPositions = {
     // Initial camera position
     initial: {
       desktop: [-17.547789383813438, 11.056949441827566, -22.784703347122825] as [number, number, number],
       mobile: [-17.547789383813438, 11.056949441827566, -22.784703347122825] as [number, number, number],
     },
     
     // Initial orbit controls target
     initialTarget: {
       desktop: [4.149959777666874, 7.647045028235788, 1.2788151669711065] as [number, number, number],
       mobile: [4.149959777666874, 7.647045028235788, 1.2788151669711065] as [number, number, number],
     },
     
     // Screen focused positions (inside_screen_popup at [5.367, 5.918, -0.059])
     screenFocused: {
       camera: {
         // Position camera in front and slightly to the side of screen for good viewing angle
         desktop: [3.0, 6, 0.72] as [number, number, number],
         mobile: [2.8, 6.5, 2.2] as [number, number, number],
       },
       target: {
         // Target the actual screen position
         desktop: [7.269509471470827, 6.2971078318642945, -0.6732945365055517] as [number, number, number],
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