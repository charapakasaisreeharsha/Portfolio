const carousel = document.querySelector('.carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const cards = document.querySelectorAll('.card');
const paginationDotsContainer = document.getElementById('paginationDots');

let index = 0;
let cardsVisible = 1; // Always show one card

// Create pagination dots dynamically
function createPaginationDots() {
    for (let i = 0; i < cards.length; i++) {
        const dot = document.createElement("div");
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            index = i;
            updateCarousel();
        });
        paginationDotsContainer.appendChild(dot);
    }
}

function updatePaginationDots() {
    const dots = paginationDotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function updateCarousel() {
    const gap = 16; // gap between cards in px (matches CSS 1rem)
    const cardWidth = cards[0].offsetWidth + gap; // card width + gap
    carousel.style.transform = `translateX(${-index * cardWidth}px)`;
    
    // Update arrow visibility based on current position
    updateArrowVisibility();
    // Update pagination dots active state
    updatePaginationDots();
}

function updateArrowVisibility() {
    // Hide prev arrow when at the beginning
    if (index <= 0) {
        prevBtn.style.opacity = '0.3';
        prevBtn.style.pointerEvents = 'none';
    } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';
    }
    
    // Hide next arrow when at the end
    if (index >= cards.length - cardsVisible) {
        nextBtn.style.opacity = '0.3';
        nextBtn.style.pointerEvents = 'none';
    } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';
    }
}

nextBtn.addEventListener('click', () => {
    if (index < cards.length - cardsVisible) {
        index++;
        updateCarousel();
    }
});

prevBtn.addEventListener('click', () => {
    if (index > 0) {
        index--;
        updateCarousel();
    }
});

window.addEventListener('resize', () => {
    // Always show one card regardless of screen size
    cardsVisible = 1;
    
    // Reset index if it would be out of bounds after resize
    if (index > cards.length - cardsVisible) {
        index = Math.max(0, cards.length - cardsVisible);
    }
    
    updateCarousel();
});

// Initialize
createPaginationDots();
updateCarousel();

// ========== GITHUB PROJECTS SECTION ========== 
async function loadGitHubProjects() {
    const container = document.getElementById("github-projects");

    // 👉 Repos to exclude (add more names if needed)
    const excludeRepos = ["portfolio", "test-repo", "demo-project"];

    try {
        const response = await fetch("https://api.github.com/users/charapakasaisreeharsha/repos");
        const repos = await response.json();

        // Clear loading spinner
        container.innerHTML = "";

        // Filter excluded repos
        let filtered = repos.filter(repo => !excludeRepos.includes(repo.name.toLowerCase()));

        // Sort by most recently updated (new to old)
        filtered.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

        // Create project cards
        filtered.forEach(repo => {
            const card = document.createElement("div");
            card.className = "project-card";
            card.innerHTML = `
                <h3 class="project-title">${repo.name}</h3>
                <p class="project-desc">${repo.description || "No description available"}</p>
                <div class="project-footer">
                    <span>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</span>
                    <a href="${repo.html_url}" target="_blank" class="project-btn">View Repo</a>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = "<p>⚠️ Failed to load projects. Please try again later.</p>";
        console.error("Error loading GitHub projects:", error);
    }
}

// Load projects on page load
loadGitHubProjects();

// ========== SEARCH FUNCTIONALITY ========== 
// Search filter for projects
function setupSearch() {
    const searchInput = document.getElementById("search-projects");
    if (!searchInput) return;

    // Debounce function for better performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Search function
    const searchProjects = debounce((query) => {
        const cards = document.querySelectorAll(".project-card");
        if (cards.length === 0) return;

        let visibleCount = 0;
        const searchTerm = query.toLowerCase();

        cards.forEach(card => {
            const title = card.querySelector(".project-title").textContent.toLowerCase();
            const desc = card.querySelector(".project-desc").textContent.toLowerCase();
            
            if (title.includes(searchTerm) || desc.includes(searchTerm)) {
                card.style.display = "block";
                card.style.animation = "fadeIn 0.3s ease-in";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Handle no results
        const noResultsMsg = document.querySelector(".no-results");
        if (visibleCount === 0 && query !== "") {
            if (!noResultsMsg) {
                const container = document.getElementById("github-projects");
                const msg = document.createElement("p");
                msg.className = "no-results";
                msg.textContent = `No projects found matching "${query}"`;
                msg.style.textAlign = "center";
                msg.style.color = "#666";
                msg.style.padding = "2rem";
                container.appendChild(msg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }, 300);

    // Add event listener
    searchInput.addEventListener("input", (e) => {
        searchProjects(e.target.value);
    });

    // Clear search functionality
    function clearSearch() {
        searchInput.value = "";
        const cards = document.querySelectorAll(".project-card");
        cards.forEach(card => {
            card.style.display = "block";
        });
        const noResultsMsg = document.querySelector(".no-results");
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // Add clear button
    const searchContainer = document.querySelector(".search-box");
    if (searchContainer) {
        const clearBtn = document.createElement("button");
        clearBtn.className = "clear-search";
        clearBtn.innerHTML = '<i class="fas fa-times"></i>';
        clearBtn.style.cssText = `
            display: none;
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
            font-size: 14px;
        `;
        clearBtn.onclick = clearSearch;
        
        searchContainer.style.position = "relative";
        searchContainer.appendChild(clearBtn);
        
        // Show/hide clear button
        searchInput.addEventListener("input", (e) => {
            clearBtn.style.display = e.target.value ? "block" : "none";
        });
    }
}

// Initialize search after projects are loaded
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(setupSearch, 1000);
    setupContactForm();
});

// Fade in animation on scroll
document.addEventListener("DOMContentLoaded", () => {
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.getAttribute('data-animation');
                entry.target.classList.add(animation);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animation]').forEach(element => {
        animationObserver.observe(element);
    });
});

// Contact Form Functionality with EmailJS
function setupContactForm() {
    // EmailJS Configuration - Actual credentials
    const SERVICE_ID = "service_xw2g7z4";
    const TEMPLATE_ID = "template_dcxyzad";
    const PUBLIC_KEY = "0UZ3REUcSffRL7hgw";

    // Initialize EmailJS
    emailjs.init(PUBLIC_KEY);

    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Create status message element
    const statusDiv = document.createElement('div');
    statusDiv.id = 'form-status';
    statusDiv.style.cssText = `
        margin-top: 1rem;
        padding: 0.75rem;
        border-radius: 8px;
        text-align: center;
        font-weight: 500;
        display: none;
    `;
    contactForm.appendChild(statusDiv);

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Send form data via EmailJS
        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this)
            .then(() => {
                // Success
                statusDiv.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
                statusDiv.style.cssText += 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb; display: block;';
                contactForm.reset();
                
                // Hide status after 5 seconds
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                }, 5000);
            })
            .catch((error) => {
                // Error
                statusDiv.textContent = '❌ Failed to send message. Please try again.';
                statusDiv.style.cssText += 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; display: block;';
                console.error('EmailJS Error:', error);
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}