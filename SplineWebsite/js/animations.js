// Utility function for Intersection Observer
const createObserver = (callback, options = { threshold: 0.1 }) => {
  return new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, options);
};

// Page load and initial animations
document.addEventListener('DOMContentLoaded', () => {
  // --- Main Content Fade In ---
  anime({
    targets: 'main', // Target the main content area
    opacity: [0, 1],
    translateY: [20, 0], // Add subtle upward movement
    duration: 800,
    easing: 'easeInOutQuad'
  });

  // --- Hero Text Animation ---
  const heroTimeline = anime.timeline({
    easing: 'easeOutExpo',
    duration: 1000
  });
  heroTimeline
    .add({
      targets: '.hero-text h2',
      opacity: [0, 1],
      translateY: [30, 0],
      delay: 300 // Start after body fade-in
    })
    .add({
      targets: '.hero-text p',
      opacity: [0, 1],
      translateY: [30, 0],
    }, '-=600'); // Overlap with h2 animation

  // --- Navigation Menu Effects ---
  const navItems = document.querySelectorAll('nav ul li a');
  navItems.forEach(item => {
    // Hover effect
    item.addEventListener('mouseenter', () => {
      anime({
        targets: item,
        scale: 1.1,
        color: '#06B6D4', // Highlight color
        duration: 200,
        easing: 'easeOutQuad'
      });
    });
    item.addEventListener('mouseleave', () => {
      anime({
        targets: item,
        scale: 1,
        color: '#ffffff', // Original color
        duration: 200,
        easing: 'easeOutQuad'
      });
    });

    // Click feedback
    item.addEventListener('click', (e) => {
      // Optional: Prevent default if scrolling manually
      // e.preventDefault();
      // const targetId = item.getAttribute('href');
      // document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });

      anime({
        targets: item,
        backgroundColor: ['rgba(6, 182, 212, 0.3)', 'rgba(6, 182, 212, 0)'], // Quick flash
        duration: 400,
        easing: 'linear'
      });
    });
  });

  // Product Card Animations are now initialized by initializeProductCardAnimations()
  // called from script.js after cards are created.

  // --- Scroll-Triggered Section Title (#products h2) ---
  const productsTitle = document.querySelector('#products h2');
  if (productsTitle) {
    const titleObserver = createObserver(title => {
      anime({
        targets: title,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutExpo'
      });
    });
    titleObserver.observe(productsTitle);
  }

  // --- Scroll-Triggered Stats Animation ---
  const statsSection = document.querySelector('#stats');
  if (statsSection) {
    const statsObserver = createObserver(section => {
      animateStats(section); // Pass the section to animate numbers within it
    }, { threshold: 0.5 }); // Trigger when 50% visible
    statsObserver.observe(statsSection);
  }

  // --- (Optional) Subtle Background Animation ---
  // Removed the floating elements from the original code as they weren't requested
  // and the optional background animation is commented out by default.
  // If you want the subtle background shapes, uncomment the section below
  // and add corresponding CSS for `.bg-shape`.
  /*
  const bgContainer = document.createElement('div');
  bgContainer.style.position = 'fixed';
  bgContainer.style.top = '0';
  bgContainer.style.left = '0';
  bgContainer.style.width = '100%';
  bgContainer.style.height = '100%';
  bgContainer.style.zIndex = '-1';
  bgContainer.style.overflow = 'hidden';
  document.body.prepend(bgContainer); // Add behind everything

  for (let i = 0; i < 15; i++) {
    const shape = document.createElement('div');
    shape.className = 'bg-shape'; // Style this in CSS: position: absolute, border-radius: 50%, background-color: rgba(..., 0.1) etc.
    shape.style.width = `${anime.random(50, 150)}px`;
    shape.style.height = shape.style.width;
    shape.style.top = `${anime.random(0, 100)}%`;
    shape.style.left = `${anime.random(0, 100)}%`;
    shape.style.opacity = 0;
    bgContainer.appendChild(shape);

    anime({
      targets: shape,
      opacity: [0, anime.random(0.05, 0.15), 0],
      scale: [1, anime.random(1.2, 1.8)],
      duration: anime.random(5000, 10000),
      delay: anime.random(0, 5000),
      easing: 'easeInOutSine',
      loop: true,
    });
  }
  */

  // --- Parallax effect on hero text (Optional - keep if desired) ---
  // Replaced scroll event listener with Intersection Observer for most scroll effects,
  // but keeping the parallax for the hero text as it's a continuous effect.
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    // Check if .hero-text exists before animating
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
        anime({
          targets: heroText,
          translateY: scrollPosition * 0.3,
          easing: 'easeOutQuad',
          duration: 0 // Make parallax immediate for responsiveness
        });
    }
  }, { passive: true }); // Improve scroll performance

  // --- Horizontal Scroll for Case Studies ---
  const caseStudiesContainer = document.querySelector('.case-studies-container');
  const caseStudiesSection = document.querySelector('.case-studies-section'); // Need the trigger section

  if (caseStudiesContainer && caseStudiesSection) { // Check if both elements exist
      const numCaseStudies = caseStudiesContainer.children.length;
      if (numCaseStudies > 1) { // Only animate if there's more than one study
          const translateXEnd = - (100 / numCaseStudies) * (numCaseStudies - 1) + '%'; // Calculate end value

          anime({
            targets: caseStudiesContainer,
            translateX: translateXEnd,
            easing: 'linear',
            scroll: {
              trigger: caseStudiesSection, // Use the section as the trigger
              // target: caseStudiesContainer, // Optional: Can sometimes help performance/accuracy
              start: 'top top', // Animation starts when the top of the section hits the top of the viewport
              end: 'bottom bottom', // Animation ends when the bottom of the section hits the bottom of the viewport
              scrub: true // Smoothly links animation progress to scroll progress
            }
          });
      }
  }

}); // End DOMContentLoaded

// --- Enhanced Drone Animation ---
// Called from script.js
function animateDrone(drone) {
  // Stop any previous animation on these targets to prevent conflicts
  anime.remove(drone.rotation);
  anime.remove(drone.position);

  // Use a timeline for combined movements
  const droneTimeline = anime.timeline({
    targets: drone,
    loop: true,
    easing: 'linear', // Base easing for continuous motion
    duration: 10000 // Overall duration for one loop of combined effects
  });

  droneTimeline
    .add({
      // Continuous Rotation (using update callback for smooth integration)
      targets: drone.rotation,
      y: `+=${2 * Math.PI * (10000 / 6000)}`, // Match original speed roughly over timeline duration
      duration: 10000,
      easing: 'linear'
    }, 0) // Start at the beginning
    .add({
      // Vertical Bobbing
      targets: drone.position,
      y: [0, 0.15, 0], // Bob up and down slightly
      duration: 4000,
      easing: 'easeInOutSine',
      loop: true, // Loop the bobbing independently within the timeline
      direction: 'alternate'
    }, 0) // Start at the beginning
    .add({
        // Subtle Horizontal Drift
        targets: drone.position,
        x: [0, -0.1, 0.1, 0], // Drift side to side
        duration: 6000,
        easing: 'easeInOutSine',
        loop: true, // Loop the drift independently
        direction: 'alternate'
    }, 500); // Start slightly after bobbing begins

  // Note: The propeller rotation is still handled in script.js's requestAnimationFrame loop.
  // This anime.js timeline controls the drone's overall position and rotation.

  return droneTimeline; // Return the timeline instance (though script.js doesn't currently use the return value)
}

// --- Initialize Product Card Animations ---
// Called from script.js after product cards are added to the DOM
function initializeProductCardAnimations() {
  const productCards = document.querySelectorAll('.product-card');

  if (productCards.length === 0) {
    console.warn("initializeProductCardAnimations called, but no '.product-card' elements found.");
    return; // Exit if no cards are present yet
  }

  // Entrance Animation (using Intersection Observer)
  const cardObserver = createObserver(card => {
    anime({
      targets: card,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      easing: 'easeOutQuad',
      delay: anime.stagger(100) // Stagger if multiple cards become visible together
    });
  });
  productCards.forEach(card => cardObserver.observe(card));


  // Hover Effects
  productCards.forEach(card => {
    // Store original color for reset
    const categoryElement = card.querySelector('.category');
    const originalColor = categoryElement ? getComputedStyle(categoryElement).color : '#9CA3AF'; // Fallback

    card.addEventListener('mouseenter', () => {
      anime({
        targets: card,
        scale: 1.05,
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
        duration: 300,
        easing: 'easeOutQuad'
      });
      if (categoryElement) {
        anime({ // Animate category text color
          targets: categoryElement,
          color: '#06B6D4',
          duration: 300
        });
      }
    });
    card.addEventListener('mouseleave', () => {
      anime({
        targets: card,
        scale: 1,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Reset to default or initial style
        duration: 300,
        easing: 'easeOutQuad'
      });
      if (categoryElement) {
         anime({ // Reset category text color
          targets: categoryElement,
          color: originalColor,
          duration: 300
        });
      }
    });
  });
}

// --- Animate Statistics Numbers ---
function animateStats(section) {
  const statNumbers = section.querySelectorAll('.stat-number');

  if (statNumbers.length === 0) {
    console.warn("animateStats called, but no '.stat-number' elements found within the section.");
    return;
  }

  statNumbers.forEach(element => {
    const targetValue = parseInt(element.dataset.target, 10); // Base 10

    // Check if already animated (simple flag)
    if (element.dataset.animated) {
        return;
    }
    element.dataset.animated = 'true'; // Mark as animated

    anime({
      targets: element,
      innerHTML: [0, targetValue], // Animate the text content
      round: 1, // Round to whole numbers
      easing: 'easeOutExpo', // Smooth easing
      duration: 2000 // Animation duration in ms
    });
  });
}
// --- Scroll-Triggered Spline Showcase Animation ---
document.addEventListener('DOMContentLoaded', () => {
  const splineShowcaseSection = document.querySelector('.spline-showcase');

  if (splineShowcaseSection) {
    const splineObserver = createObserver(section => {
      const splineViewer = section.querySelector('#product-spline-viewer');
      if (splineViewer) {
        // Trigger the rotation animation
        anime({
          targets: splineViewer,
          rotateY: '360deg', // Rotate 360 degrees on the Y-axis
          duration: 2500,    // Animation duration in milliseconds
          easing: 'easeInOutSine' // Smooth easing function
        });
      } else {
        console.warn("Spline showcase section is visible, but #product-spline-viewer not found inside it.");
      }
    }, { threshold: 0.3 }); // Trigger when 30% of the section is visible

    splineObserver.observe(splineShowcaseSection);
  } else {
    // Optional: Log if the section isn't found on the page
    // console.log("Spline showcase section (.spline-showcase) not found on this page.");
  }
});
// Timeline Animation
const timelineObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const timelineEvents = entry.target.querySelectorAll('.timeline-event');
      anime.timeline({ easing: 'easeOutExpo' })
        .add({
          targets: timelineEvents,
          opacity: [0, 1],
          translateY: [30, 0],
          delay: anime.stagger(250)
        });
      observer.unobserve(entry.target); // Animate only once
    }
  });
}, { threshold: 0.2 }); // Trigger when 20% visible

const timeline = document.querySelector('.timeline');
if (timeline) { // Check if timeline exists on the page
  timelineObserver.observe(timeline);
}
// Team Card Entrance Animation
const teamGridObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const teamCards = entry.target.querySelectorAll('.team-card');
      anime({
        targets: teamCards,
        opacity: [0, 1],
        scale: [0.9, 1],
        delay: anime.stagger(150),
        easing: 'easeOutExpo',
        duration: 800
      });
      observer.unobserve(entry.target); // Animate only once
    }
  });
}, { threshold: 0.1 }); // Trigger when 10% visible

const teamGrid = document.querySelector('.team-grid');
if (teamGrid) { // Check if grid exists on the page
  teamGridObserver.observe(teamGrid);
}
// --- Contact Page Specific Animations ---
document.addEventListener('DOMContentLoaded', () => {

  // --- SVG Path Animation (Contact Page Map) ---
  const mapSection = document.querySelector('.map-section');
  const serviceAreaPaths = document.querySelectorAll('.map-section .service-area');

  if (mapSection && serviceAreaPaths.length > 0) {
    // Initialize paths for animation
    serviceAreaPaths.forEach(path => {
      // Ensure the path has a length before trying to set dashoffset
      const length = path.getTotalLength();
      if (length > 0) {
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
      } else {
        console.warn(`Path ${path.id || 'without ID'} has zero length. Cannot animate.`);
      }
    });

    const mapObserver = createObserver(target => {
      anime({
        targets: '.map-section .service-area',
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        duration: 1500,
        delay: anime.stagger(300, {start: 200}) // Stagger the start of each path animation
      });
      // No need to unobserve here as createObserver already does it
    }, { threshold: 0.4 }); // Trigger when 40% visible

    mapObserver.observe(mapSection);
  }

  // --- Chat Bubble Entrance Animation ---
  const chatBubble = document.getElementById('chat-bubble');
  if (chatBubble) {
    anime({
      targets: chatBubble,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      easing: 'easeOutExpo',
      delay: 1000 // Delay appearance after page load
    });
  }

  // --- Contact Form Field Microinteractions ---
  const formFields = document.querySelectorAll('#contact-form input[type="text"], #contact-form input[type="email"], #contact-form textarea');
  if (formFields.length > 0) {
    formFields.forEach(field => {
      field.addEventListener('focus', () => {
        // Optional: Remove previous animations if they cause issues
        // anime.remove(field);
        anime({
          targets: field,
          scale: 1.02, // Subtle scale increase
          // Example: Change background slightly (ensure it contrasts with focus shadow)
          // backgroundColor: 'rgba(255, 255, 255, 0.15)',
          duration: 200,
          easing: 'easeOutQuad'
        });
      });

      field.addEventListener('blur', () => {
        // Optional: Remove previous animations
        // anime.remove(field);
        anime({
          targets: field,
          scale: 1, // Revert scale
          // backgroundColor: 'rgba(255, 255, 255, 0.1)', // Revert background
          duration: 300,
          easing: 'easeOutQuad'
        });
      });
    });
  }

}); // End DOMContentLoaded for contact page specific animations