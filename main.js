import './style.css';
import { gsap } from 'gsap';

const svg = document.getElementById('mySVG');
const clickableAreas = document.querySelectorAll('.rect');
let isZoomedIn = false;
const originalViewBox = svg.getAttribute('viewBox');

clickableAreas.forEach(rect => {
    rect.addEventListener('click', (event) => {
        event.stopPropagation();

        const bbox = rect.getBBox();

        if (!isZoomedIn) {
            // Calculate new viewBox values for zoom-in
            const newWidth = bbox.width;
            const newHeight = bbox.height;
            const newX = bbox.x;
            const newY = bbox.y;

            // Animate the viewBox using GSAP
            gsap.to(svg, {
                duration: 1,
                ease: "expo.out",
                onUpdate: () => {
                    svg.setAttribute('viewBox', `${newX} ${newY} ${newWidth} ${newHeight}`);
                },
                onComplete: () => {
                    isZoomedIn = true;
                }
            });
        } else {
            zoomOut();
        }
    });
});

function zoomOut() {
    gsap.to(svg, {
        duration: 1,
        ease: "expo.out",
        onUpdate: () => {
            svg.setAttribute('viewBox', originalViewBox);
        },
        onComplete: () => {
            isZoomedIn = false;
        }
    });
}
