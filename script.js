document.addEventListener('DOMContentLoaded', () => {

    // --- Name Scramble Animation ---
    const nameHeading = document.getElementById('name-heading');
    if (nameHeading && nameHeading.dataset.text) { // Check if element and data attribute exist
        const targetText = nameHeading.dataset.text;
        const chars = '!<>-_\\/[]{}—=+*^?#________'; // Characters for scrambling effect
        const scrambleDuration = 2000; // Total duration in milliseconds
        const updateFrequency = 50; // Update interval in milliseconds
        let startTime;
        let animationFrameId;

        function randomChar() {
            return chars[Math.floor(Math.random() * chars.length)];
        }

        function updateText(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsedTime = timestamp - startTime;

            let scrambledText = '';
            for (let i = 0; i < targetText.length; i++) {
                const progress = elapsedTime / scrambleDuration;
                // Stagger the reveal of letters
                const charRevealTime = (i / targetText.length) * scrambleDuration * 0.6;

                if (elapsedTime > charRevealTime + Math.random() * (scrambleDuration * 0.4) || progress >= 1) {
                    // Reveal the correct letter based on timing or if animation is complete
                    scrambledText += targetText[i];
                } else {
                    // Show a random scrambling character
                    scrambledText += randomChar();
                }
            }

            nameHeading.textContent = scrambledText;

            // Continue animation if duration not reached
            if (elapsedTime < scrambleDuration) {
                animationFrameId = requestAnimationFrame(updateText);
            } else {
                nameHeading.textContent = targetText; // Ensure final text is correct
            }
        }

        // Start the animation slightly delayed (allows font loading etc.)
        setTimeout(() => {
             // Cancel any previous frame request if it exists (safety)
             if (animationFrameId) {
                 cancelAnimationFrame(animationFrameId);
             }
             startTime = null; // Reset start time for potential restart
             animationFrameId = requestAnimationFrame(updateText);
        }, 100);
    } else {
        console.warn("Name heading element or data-text attribute not found.");
    }


    // --- Sidebar Navigation & Scrollspy ---
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('.main-content section[id]'); // Target only sections with IDs inside main-content

    if (sidebarLinks.length > 0 && sections.length > 0) {
        // Function to handle smooth scrolling
        function smoothScroll(event) {
            event.preventDefault();
            const targetId = event.currentTarget.getAttribute('href');
            if (!targetId || targetId === '#') return; // Ignore empty or "#" links

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                 targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                console.warn(`Target section ${targetId} not found for smooth scroll.`);
            }
        }

        // Function to handle scrollspy highlighting
        function highlightNavLink() {
            let currentSectionId = '';
            const scrollPosition = window.scrollY;
            // Offset to trigger highlight slightly before section top reaches viewport top
            const highlightOffset = 150;

            sections.forEach(section => {
                // Ensure section is visible enough before highlighting
                if (section.offsetHeight > 50) { // Ignore very small sections if any
                    const sectionTop = section.offsetTop - highlightOffset;
                    const sectionBottom = sectionTop + section.offsetHeight;

                    // Check if current scroll position is within this section's bounds
                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        currentSectionId = section.getAttribute('id');
                    }
                }
            });

             // Special case: If scrolled near the bottom, highlight the last section link
             const nearBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50; // 50px buffer from bottom
             if (nearBottom && !currentSectionId) {
                 const lastSection = sections[sections.length - 1];
                 if(lastSection) currentSectionId = lastSection.getAttribute('id');
             }

            // Update active class on sidebar links
            sidebarLinks.forEach(link => {
                link.classList.remove('active');
                const linkHref = link.getAttribute('href');
                // Check if the link's href matches the current section ID (removing '#')
                if (linkHref && linkHref.slice(1) === currentSectionId) {
                    link.classList.add('active');
                }
            });

            // If no section is active (e.g., at the very top before the first section)
            // highlight the first link.
            if (!currentSectionId && scrollPosition < sections[0].offsetTop - highlightOffset) {
                sidebarLinks[0]?.classList.add('active'); // Use optional chaining for safety
            }
            // If scrolled past everything but not quite at bottom, ensure last link is active
            else if (!document.querySelector('.sidebar a.active') && scrollPosition > sections[sections.length-1].offsetTop) {
                 sidebarLinks[sidebarLinks.length - 1]?.classList.add('active');
            }
        }

        // Add smooth scroll listeners to links
        sidebarLinks.forEach(link => {
            link.addEventListener('click', smoothScroll);
        });

        // Listen for scroll events for scrollspy
        let scrollTimeout;
        window.addEventListener('scroll', () => {
             // Debounce scroll event slightly for performance
             clearTimeout(scrollTimeout);
             scrollTimeout = setTimeout(highlightNavLink, 50); // Update highlighting shortly after scrolling stops
        }, { passive: true }); // Use passive listener for better scroll performance

        // Initial call to highlight link on page load/refresh
        highlightNavLink();

    } else {
         console.warn("Sidebar links or main content sections not found for navigation/scrollspy.");
    }


    // --- Project Modal Logic ---
    const projectCardButtons = document.querySelectorAll('.project-card .expand-btn');
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = modal ? modal.querySelector('.close-btn') : null;

    if (modal && modalBody && closeModalBtn && projectCardButtons.length > 0) {
        // ================================================================
        // <<< CHANGE PROJECT DETAILS HERE >>>
        // Keys (e.g., 'proj1') MUST match 'data-project-id' on cards in HTML
        // Use HTML within the 'description' for formatting.
        // ================================================================
        const projectDetails = {
            'proj1': {
                title: 'Project Title 1 Detailed',
                image: 'project1.jpg', // Optional: Can be same or different from card
                description: `
                    <p>This is the <strong>detailed description</strong> for Project 1. You can use various HTML tags like lists:</p>
                    <ul>
                        <li>Technology Used: HTML, CSS, JavaScript</li>
                        <li>Key Feature: Interactive something</li>
                        <li>Challenge: Overcoming specific problem</li>
                    </ul>
                    <p>Add more paragraphs as needed to explain the project thoroughly.</p>
                `,
                liveLink: '#', // URL to live project or '#' if none
                repoLink: '#'  // URL to code repository or '#' if none
            },
            'proj2': {
                title: 'Project Title 2 Detailed',
                image: 'project2.jpg',
                description: `
                    <p>Detailed info about Project 2. Focus on the purpose, your contributions, and the outcome.</p>
                    <p><em>Example:</em> Built using React and Firebase.</p>
                `,
                liveLink: '#',
                repoLink: '#'
            },
            'proj3': { // Make sure you have a card with data-project-id="proj3" in HTML if you add this
                 title: 'Project Title 3 Detailed',
                 image: 'project3.jpg',
                 description: `<p>Details about the third project...</p>`,
                 liveLink: '#',
                 repoLink: '#'
             }
            // Add details for all other projects matching their 'data-project-id'
        };
        // ================================================================
        // <<< END OF PROJECT DETAILS SECTION >>>
        // ================================================================


        // Function to open the modal
        function openModal(projectId) {
            const details = projectDetails[projectId];

            if (details) {
                // Construct modal content safely
                let linksHTML = '';
                const liveValid = details.liveLink && details.liveLink !== '#';
                const repoValid = details.repoLink && details.repoLink !== '#';

                if (liveValid) {
                    linksHTML += `<a href="${details.liveLink}" target="_blank" rel="noopener noreferrer">View Live</a>`;
                }
                if (liveValid && repoValid) {
                    linksHTML += ' | '; // Separator only if both links exist
                }
                if (repoValid) {
                     linksHTML += `<a href="${details.repoLink}" target="_blank" rel="noopener noreferrer">View Code</a>`;
                }

                modalBody.innerHTML = `
                    <h2>${details.title || 'Project Details'}</h2>
                    ${details.image ? `<img src="${details.image}" alt="${details.title || 'Project Image'}">` : ''}
                    ${details.description || '<p>No description available.</p>'}
                    ${linksHTML ? `<p class="modal-links">${linksHTML}</p>` : ''}
                `;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                setTimeout(() => modal.classList.add('visible'), 10); // Add class for potential transition effect
            } else {
                console.error(`Project details not found for ID: ${projectId}`);
                 modalBody.innerHTML = `<p>Sorry, details for this project could not be loaded.</p>`;
                 modal.style.display = 'block';
                 document.body.style.overflow = 'hidden';
                 setTimeout(() => modal.classList.add('visible'), 10);
            }
        }

        // Function to close the modal
        function closeModal() {
            modal.classList.remove('visible'); // For transition effect
             // Wait for potential fade-out transition before hiding and clearing
             // Adjust timeout duration based on CSS transition if you add one
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
                modalBody.innerHTML = ''; // Clear content
            }, 200); // e.g., 200ms = 0.2s transition
        }

        // Add click listener to each project card button
        projectCardButtons.forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.project-card');
                if (card && card.dataset.projectId) {
                    openModal(card.dataset.projectId);
                } else {
                     console.error("Could not find project ID on clicked card button.");
                }
            });
        });

        // Add listeners to close the modal
        closeModalBtn.addEventListener('click', closeModal);

        // Close modal if user clicks outside the modal content (on the overlay)
        modal.addEventListener('click', (event) => {
            if (event.target === modal) { // Check if the click was directly on the modal background
                closeModal();
            }
        });

         // Close modal on Escape key press
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });

    } else {
         console.warn("Modal elements or project card buttons not found. Modal functionality disabled.");
    }


    // --- Footer Year ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

}); // End DOMContentLoaded
