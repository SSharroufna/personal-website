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
                        // Call the scroll
                        document.addEventListener('scroll', handleScroll);
                    }
                }
            );
        } else {
            zoomOut();
        }
    });
});

function handleScroll() {

    const sectionIdMap = {
        'aboutSection': 'aboutSection',
        'projectsSection': 'projectsSection',
        'experienceSection': 'experienceSection',
        'contactSection': 'contactSection'
    };

}


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
