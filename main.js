import './style.css'
import { gsap } from 'gsap';

// Select the element to animate
const myElement = document.getElementById('myElement');

// Animate the element
gsap.to(myElement, { rotation: 360, duration: 2 });

