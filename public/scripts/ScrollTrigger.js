/**
 * @file gsap.js
 * @author Fatima El Hilali
 * @description Voegt een subtiel parallax- en fade-in effect toe aan kunstwerken 
 * bij scrollen. Past dit ook toe op nieuw geladen kunstwerken bij infinite scroll.
 * @source GSAP Documentatie (https://greensock.com/docs/), sprint 6  en 
 * https://javascript.info/mutation-observer .
 * @sprint 9
 */


document.addEventListener("DOMContentLoaded", () => {
    // Activeert de ScrollTrigger-plugin van GSAP
    gsap.registerPlugin(ScrollTrigger);

    /**
     * @function applyScrollTrigger
     * @description Voegt een fade-in, scale-in en parallax-effect toe aan kunstwerken
     * wanneer ze in beeld komen. Dit zorgt voor een vloeiende scroll-ervaring.
     */
    const applyScrollTrigger = () => {
        // Selecteert alle kunstwerken binnen de galerij
        document.querySelectorAll(".art-gallery .art-item").forEach(item => {
            // Zet de beginwaarden voor de animatie
            gsap.set(item, { opacity: 0, scale: 0.95, y: 50 });

            // Voert de animatie uit wanneer het item in beeld komt
            gsap.to(item, {
                opacity: 1,   // Fade-in effect
                scale: 1,     // Schaal terug naar normaal formaat
                y: 0,         // Laat het kunstwerk langzaam omhoog komen
                duration: 1.8, 
                ease: "power1.out", //  effect

                scrollTrigger: { 
                    trigger: item, // Activeer animatie wanneer dit item in beeld komt
                    start: "top 90%", // Animatie start wanneer het item bijna in beeld is
                    end: "top 50%", // Animatie eindigt als het halverwege de viewport is
                    scrub: true, // Maakt een  beweging  tijdens scrollen (parallax-effect)
                    toggleActions: "play reverse play reverse" // Speel af bij in-scroll, terug bij uit-scroll
                }
            });
        });
    };

    applyScrollTrigger(); // Activeer de animaties op de bestaande kunstwerken

    /**
     * @constant {HTMLElement} galleryContainer
     * @description De container waarin de kunstwerken staan.
     * Dit wordt gebruikt om te controleren of er nieuwe kunstwerken worden toegevoegd.
     */
        const galleryContainer = document.querySelector(".art-gallery");
    
        if (galleryContainer) {
            /**
             * @class MutationObserver
             * @description Kijkt of er nieuwe kunstwerken worden toegevoegd aan de galerij.
             * Als er nieuwe kunstwerken verschijnen (bijvoorbeeld door infinite scroll),
             * wordt de animatie automatisch op deze nieuwe items toegepast.
             */
            new MutationObserver(() => applyScrollTrigger()).observe(galleryContainer, { childList: true, subtree: true });
        }
    });