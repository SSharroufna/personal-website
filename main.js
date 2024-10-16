import './style.css';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

document.addEventListener('DOMContentLoaded', function () {
    handleScroll();
});

// Register GSAP plugins
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);
const svg = document.getElementById('mySVG');

// Zooming in and out of the SVG
const clickableAreas = document.querySelectorAll('rect');
const originalViewBox = svg.getAttribute('viewBox');
let isZoomedIn = false;

clickableAreas.forEach(rect => {
    rect.addEventListener('click', (event) => {
        event.stopPropagation();
        const bbox = rect.getBBox();
        const newViewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;

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
                        document.body.style.overflow = 'auto';
                        gsap.set('#container', {
                            left: window.innerWidth / 2 - bbox.x - bbox.width / 2,
                            top: window.innerHeight / 2 - bbox.y - bbox.height / 2,
                        });
                        handleScroll();
                    }
                }
            );
        } else {
            zoomOut();
        }
    });
});

// Initial scroll handling
let scrollTimeline;

function handleScroll() {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const speed = 20;
    const scrollDist = wh * speed;
    const scrollEnd = wh * (speed - 1);
    const svgWidth = svg.getBoundingClientRect().width;
    const svgHeight = svg.getBoundingClientRect().height;

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

    if (scrollTimeline) scrollTimeline.kill();
    scrollTimeline = gsap.timeline({
        defaults: { duration: 1, ease: 'none' },
        scrollTrigger: {
            trigger: '#scrollDist',
            start: 'top top',
            end: '+=' + scrollEnd,
            scrub: 0.3,
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

    // Move container to follow circle
    let povDelay = 1;
    let pos = { x: -svgWidth / 2, y: -svgHeight / 2 };
    const xSet = gsap.quickSetter('#container', "x", "px");
    const ySet = gsap.quickSetter('#container', "y", "px");

    gsap.ticker.add(() => {
        pos.x += (-gsap.getProperty('#movingCircle', 'x') - pos.x) * povDelay;
        pos.y += (-gsap.getProperty('#movingCircle', 'y') - pos.y) * povDelay;
        xSet(pos.x);
        ySet(pos.y);
    });

    window.onresize = () => {
        gsap.set('#container', { left: window.innerWidth / 2, top: window.innerHeight / 2 });
    };
}

// Zoom out function
function zoomOut() {
    gsap.fromTo(svg,
        { scale: 1, attr: { viewBox: svg.getAttribute('viewBox') } },
        {
            scale: 1,
            attr: { viewBox: originalViewBox },
            duration: 1.2,
            ease: "expo.out",
            onComplete: () => {
                isZoomedIn = false;
                document.body.style.overflow = 'hidden'; 
            }
        }
    );
}
