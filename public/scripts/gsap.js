/**
 * @file gsap.js
 * @author Fatima El Hilali
 * @description Dit script voegt animaties toe aan de zoeksectie en kunstgalerij met GSAP.
 * @source GSAP Documentatie (https://greensock.com/docs/) en sprint 6 code
 * @sprint 9
 */

document.addEventListener("DOMContentLoaded", () => {
    /**
     * Zoeksectie en elementen
     * @const {HTMLElement} searchSection - De zoeksectie van de pagina.
     * @const {HTMLInputElement} inputField - Het invoerveld binnen de zoeksectie.
     * @const {HTMLElement} filterNav - De filter-navigatiebalk.
     * @const {NodeList} artItems - Alle kunstwerken binnen de galerij.
     */
    const searchSection = document.querySelector(".search-section");
    const inputField = document.querySelector(".input");
    const filterNav = document.querySelector(".filter-nav");
    const artItems = document.querySelectorAll(".art-gallery .art-item");

    /**
     * Zoeksectie Fade-in Effect bij Pagina-laden
     * Laat de zoekbalk geleidelijk verschijnen met een lichte beweging en blur-effect.
     */
    if (searchSection) {
        gsap.fromTo(
            searchSection,
            { 
                opacity: 0,
                y: -50, 
                filter: "blur(10px)" 
            },
            { 
                opacity: 1,
                y: 0,
                filter: "blur(0px)", 
                duration: 1.5, 
                ease: "expo.out" 
            }
        );
    }

    /**
     * Kunstgalerij Fade-in Effect
     * Laat alle kunstwerken vloeiend verschijnen met een kleine schaalverandering.
     */
    
    gsap.fromTo(
        ".art-gallery .art-item",
        { 
            opacity: 0,
            y: 50, 
            scale: 0.9, 
            filter: "blur(10px)" 
        },
        { 
            opacity: 1,
            y: 0, 
            scale: 1, 
            filter: "blur(0px)", 
            duration: 1.8, 
            stagger: 0.15, 
            ease: "expo.out" 
        }
    );

    /**
     * Zoekveld Focus Effect
     * Bij focus op het zoekveld wordt deze vergroot en krijgt een gouden schaduw.
     * De filter-navigatie verdwijnt tijdelijk.
     */
    if (inputField) {
        inputField.addEventListener("focus", () => {
            gsap.to(inputField, {
                scale: 1.1,
                boxShadow: "0px 0px 15px rgba(255, 204, 0, 0.5)", // Gouden schaduw
                duration: 0.4,
                ease: "expo.out"
            });

            if (filterNav) {
                gsap.to(filterNav, {
                    opacity: 0, 
                    scale: 0.8, 
                    duration: 0.5, 
                    ease: "expo.out", 
                    pointerEvents: "none"
                });
            }
        });

        /**
         * Zoekveld Blur Effect
         * Bij het verlaten van het zoekveld wordt de oorspronkelijke staat hersteld.
         * De filter-navigatie verschijnt opnieuw met een vloeiende animatie.
         */
        inputField.addEventListener("blur", () => {
            gsap.to(inputField, { 
                scale: 1, 
                boxShadow: "none", 
                duration: 0.4, 
                ease: "expo.out" 
            });

            if (filterNav) {
                gsap.to(filterNav, { 
                    opacity: 1, 
                    scale: 1, 
                    duration: 0.5, 
                    ease: "expo.out", 
                    pointerEvents: "auto" 
                });

                /**
                 * Animatie voor het opnieuw verschijnen van de filter-items.
                 */
                gsap.fromTo(
                    filterNav.querySelectorAll("li"),
                    { 
                        opacity: 0,
                        y: 20,
                        scale: 0.9 
                    },
                    { 
                        opacity: 1,
                        y: 0, 
                        scale: 1, 
                        stagger: 0.1, 
                        duration: 0.5, 
                        ease: "back.out(1.7)" 
                    }
                );
            }
        });
    }
});
