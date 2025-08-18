import React, { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import './style.css'
import Lenis from 'lenis';
import Image from 'next/image';

const FadingTransition = () => {

     useEffect(() => {
          // const lenis = new Lenis({
          //      autoRaf: true,
          //      lerp: 0.05,
          // })
          // lenis.start()

          gsap.registerPlugin(ScrollTrigger);
          const pinHeight = document.querySelector('.mwg_effect037 .pin-height') as HTMLElement;
          const container = document.querySelector('.mwg_effect037 .container') as HTMLElement;

          ScrollTrigger.create({
               trigger: pinHeight,
               start: "top top",
               end: "bottom bottom",
               pin: container,
               markers: true,
               scroller: document.querySelector('#popup-content') as HTMLElement
          })

          // Start animation
          const medias = document.querySelectorAll('.mwg_effect037 .hidden');
          gsap.to(medias, {
               maskImage: "linear-gradient(transparent -25%, #000 0%, #000 100%)",
               ease: "power3.inOut",
               stagger: 0.5,
               scrollTrigger: {
                    trigger: pinHeight,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                    scroller: document.querySelector('#popup-content') as HTMLElement
               }
          })

          const mediasChild = document.querySelectorAll('.mwg_effect037 .media')
          gsap.to(mediasChild, {
          y: -30, // Move the image up by 30px
          stagger: 0.5, // Evenly spaces out all animations
          ease: 'power3.inOut',
          scrollTrigger: {
               trigger: pinHeight, // We listen to pinHeight position
               start:'top top',
               end: 'bottom bottom',
               scrub: true, // Progress follows scroll position
               scroller: document.querySelector('#popup-content') as HTMLElement
          }
          })

          const viewportHeight = ((document.querySelector('#popup-content') as HTMLElement | null)?.clientHeight ?? window.innerHeight)
          const distancePerImage = (pinHeight.clientHeight - viewportHeight) / medias.length
          console.log(pinHeight.clientHeight, viewportHeight)
          gsap.to(mediasChild, {
               y: -60, // Move the image up by 60px
               stagger: 0.5, // Evenly spaces out all animations
               immediateRender: false, // Avoids conflicts with the previous tween
               ease: 'power3.inOut',
               scrollTrigger: {
                   trigger: pinHeight, // We listen to pinHeight position
                   start:'top top-=' + distancePerImage,
                   end: 'bottom bottom-=' + distancePerImage,
                         scrub: true, // Progress follows scroll position
                   scroller: document.querySelector('#popup-content') as HTMLElement
               }
           })
           
     }, []);
          

  return (
     <section className="mwg_effect037">
     <div className="pin-height">
         <div className="container">
             <p className="text">Collection</p>
             <div className="images">
                 <div className="hidden"><Image className="media" src="/FadingTransition/medias/1.png" alt="1" fill sizes="30vw" priority /></div>
                 <div className="hidden"><Image className="media" src="/FadingTransition/medias/2.png" alt="2" fill sizes="30vw" /></div>
                 <div className="hidden"><Image className="media" src="/FadingTransition/medias/3.png" alt="3" fill sizes="30vw" /></div>
                 <div className="hidden"><Image className="media" src="/FadingTransition/medias/4.png" alt="4" fill sizes="30vw" /></div>
                 <div className="hidden"><Image className="media" src="/FadingTransition/medias/5.png" alt="5" fill sizes="30vw" /></div>
             </div>
             <p className="text">Fall 24-25</p>
         </div>
     </div>
 </section>
  )
}

export default FadingTransition