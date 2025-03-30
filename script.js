document.addEventListener('DOMContentLoaded', () => {

    // --- Name Scramble Animation ---
    const nameHeading = document.getElementById('name-heading');
    // Check for element and data attributes needed for two-line animation
    if (nameHeading && nameHeading.dataset.first && nameHeading.dataset.last) {
        const firstName = nameHeading.dataset.first;
        const lastName = nameHeading.dataset.last;
        const targetText = firstName + lastName; // Combine for length calculation
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        const scrambleDuration = 2000; // Duration in ms
        let startTime;
        let animationFrameId;

        function randomChar() {
            return chars[Math.floor(Math.random() * chars.length)];
        }

        function updateText(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsedTime = timestamp - startTime;

            let scrambledCombinedText = '';
            // Generate scrambled text based on combined length
            for (let i = 0; i < targetText.length; i++) {
                const progress = elapsedTime / scrambleDuration;
                const charRevealTime = (i / targetText.length) * scrambleDuration * 0.6;

                if (elapsedTime > charRevealTime + Math.random() * (scrambleDuration * 0.4) || progress >= 1) {
                    scrambledCombinedText += targetText[i];
                } else {
                    scrambledCombinedText += randomChar();
                }
            }

            // Split the scrambled result based on original first name length
            const scrambledFirst = scrambledCombinedText.substring(0, firstName.length);
            const scrambledLast = scrambledCombinedText.substring(firstName.length);

            // Update heading using innerHTML to render the <br> correctly
            nameHeading.innerHTML = scrambledFirst + '<br>' + scrambledLast;

            // Continue animation or set final state
            if (elapsedTime < scrambleDuration) {
                animationFrameId = requestAnimationFrame(updateText);
            } else {
                nameHeading.innerHTML = firstName + '<br>' + lastName; // Final correct state
            }
        }

        // Start animation after a short delay
        setTimeout(() => {
             if (animationFrameId) cancelAnimationFrame(animationFrameId);
             startTime = null;
             animationFrameId = requestAnimationFrame(updateText);
        }, 100);

    } else {
        console.warn("Name heading element or data-first/data-last attributes not found.");
        // Provide a fallback if the element exists but data is missing
        if (nameHeading) {
            nameHeading.innerHTML = "Your<br>Name"; // Default fallback
        }
    }


    // --- Sidebar Navigation & Scrollspy ---
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('.main-content section[id]');

    if (sidebarLinks.length > 0 && sections.length > 0) {
        // Function for smooth scrolling
        function smoothScroll(event) {
            event.preventDefault();
            const targetId = event.currentTarget.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                 targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                console.warn(`Target section ${targetId} not found for smooth scroll.`);
            }
        }

        // Function for scrollspy highlighting
        function highlightNavLink() {
            let currentSectionId = '';
            const scrollPosition = window.scrollY;
            const highlightOffset = 150; // Offset for highlighting trigger

            sections.forEach(section => {
                if (section.offsetHeight > 50) { // Ignore tiny sections
                    const sectionTop = section.offsetTop - highlightOffset;
                    const sectionBottom = sectionTop + section.offsetHeight;

                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        currentSectionId = section.getAttribute('id');
                    }
                }
            });

             // Handle reaching the bottom of the page
             const nearBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50;
             if (nearBottom && !currentSectionId) {
                 const lastSection = sections[sections.length - 1];
                 if(lastSection) currentSectionId = lastSection.getAttribute('id');
             }

            // Update active classes on links
            sidebarLinks.forEach(link => {
                link.classList.remove('active');
                const linkHref = link.getAttribute('href');
                if (linkHref && linkHref.slice(1) === currentSectionId) {
                    link.classList.add('active');
                }
            });

            // Handle edge case at the very top
            if (!currentSectionId && scrollPosition < sections[0].offsetTop - highlightOffset) {
                sidebarLinks[0]?.classList.add('active');
            }
            // Handle edge case scrolled past last section
            else if (!document.querySelector('.sidebar a.active') && scrollPosition > sections[sections.length-1].offsetTop) {
                 sidebarLinks[sidebarLinks.length - 1]?.classList.add('active');
            }
        }

        // Add click listeners for smooth scroll
        sidebarLinks.forEach(link => {
            link.addEventListener('click', smoothScroll);
        });

        // Add scroll listener for scrollspy (debounced)
        let scrollTimeout;
        window.addEventListener('scroll', () => {
             clearTimeout(scrollTimeout);
             scrollTimeout = setTimeout(highlightNavLink, 50);
        }, { passive: true });

        // Initial highlight on load
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
        // <<< REPLACE WITH YOUR ACTUAL PROJECT DETAILS >>>
        // Keys MUST match 'data-project-id' on cards in HTML
        // ================================================================
        const projectDetails = {
            'proj1': {
                title: 'Project Title 1 Detailed',
                image: 'project1.jpg',
                description: `<p>Detailed description for Project 1...</p><ul><li>Detail A</li><li>Detail B</li></ul>`,
                liveLink: '#', // URL or '#'
                repoLink: '#'  // URL or '#'
            },
            'proj2': {
                title: 'Project Title 2 Detailed',
                image: 'project2.jpg',
                description: `<p>Detailed info about Project 2...</p>`,
                liveLink: '#',
                repoLink: '#'
            },
            // Add more projects here matching HTML data-project-id
        };
        // ================================================================

        // Function to open the modal
        function openModal(projectId) {
            const details = projectDetails[projectId];
            if (details) {
                let linksHTML = '';
                const liveValid = details.liveLink && details.liveLink !== '#';
                const repoValid = details.repoLink && details.repoLink !== '#';
                if (liveValid) linksHTML += `<a href="${details.liveLink}" target="_blank" rel="noopener noreferrer">View Live</a>`;
                if (liveValid && repoValid) linksHTML += ' | ';
                if (repoValid) linksHTML += `<a href="${details.repoLink}" target="_blank" rel="noopener noreferrer">View Code</a>`;

                modalBody.innerHTML = `
                    <h2>${details.title || 'Project Details'}</h2>
                    ${details.image ? `<img src="${details.image}" alt="${details.title || 'Project Image'}">` : ''}
                    ${details.description || '<p>No description available.</p>'}
                    ${linksHTML ? `<p class="modal-links">${linksHTML}</p>` : ''}
                `;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                setTimeout(() => modal.classList.add('visible'), 10);
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
            modal.classList.remove('visible');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
                modalBody.innerHTML = '';
            }, 200); // Match CSS transition if added
        }

        // Add click listener to project buttons
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
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.style.display === 'block') closeModal();
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
