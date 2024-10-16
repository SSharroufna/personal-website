import './style.css';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


// // Moving the circle along the path
gsap.registerPlugin(MotionPathPlugin);
const svg = document.getElementById('mySVG');

document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    // Set initial states
    var ww = window.innerWidth,
        wh = window.innerHeight,
        speed = 20,
        scrollDist = wh * speed,
        scrollEnd = wh * (speed - 1),
        svgWidth = svg.getBoundingClientRect().width,
        svgHeight = svg.getBoundingClientRect().height;

    gsap.set('#scrollDist', { width: '100%', height: scrollDist });
    gsap.set('#container', {
        position: 'fixed',
        width: svgWidth,
        height: svgHeight,
        transformOrigin: '0 0',
        left: window.innerWidth / 2,
        top: window.innerHeight / 2,
        xPercent: -50,
        yPercent: -50,
        autoAlpha: 1
    });

    // GSAP timeline with ScrollTrigger
    gsap.timeline({
        defaults: { duration: 1, ease: 'none' },
        scrollTrigger: {
            trigger: '#scrollDist',
            start: 'top top',
            end: '+=' + scrollEnd,
            scrub: 0.3,
            onUpdate: ({ progress }) => console.log(progress) // info for position
        }
    })
        .to('#movingCircle', {
            motionPath: {
                path: "#letterS .cls-1",
                align: "#letterS .cls-1",
                alignOrigin: [0.5, 0.5],
                start: 1,
                end: 0,
                autoRotate: true
            },
        }, 0);
});

// Zooming in and out of the SVG
const clickableAreas = document.querySelectorAll('rect');
const originalViewBox = svg.getAttribute('viewBox');
let isZoomedIn = false;

clickableAreas.forEach(rect => {
    rect.addEventListener('click', (event) => {
        event.stopPropagation();
        const bbox = rect.getBBox();
        const newViewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;

        const clickedId = rect.getAttribute('id');
        console.log(clickedId);

        if (!isZoomedIn) {
            gsap.fromTo(svg,
                { scale: 0.1, attr: { viewBox: originalViewBox } },
                {
                    scale: 1,
                    attr: { viewBox: newViewBox },
                    duration: 1.2,
                    ease: "expo.out",
                    onComplete: () => {
                        isZoomedIn = true;
                        // Allow for scrolling when zoomed in
                    }
                }
            );
        } else {
            zoomOut();
        }
    });
});

function zoomOut() {
    // Zoom-out animation using fromTo
    gsap.fromTo(svg,
        { scale: 1, attr: { viewBox: svg.getAttribute('viewBox') } },
        {
            scale: 1,
            attr: { viewBox: originalViewBox },
            duration: 1.2,
            ease: "expo.out",
            onComplete: () => {
                isZoomedIn = false;
            }
        }
    );
}
