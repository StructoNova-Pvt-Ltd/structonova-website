/* SHARED MOBILE MENU
This block opens and closes the navigation menu on smaller screens.
It updates aria-expanded so screen readers know whether the menu is open.
*/
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");

function closeMenu() {
  if (!menuButton || !navigation) return;
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuButton.focus();
    }
  });
}

/* B7. ACTIVE MENU UNDERLINE ON THE HOME PAGE
This block checks which major section is closest to the middle of the screen.
It then moves the orange underline to the matching menu link.
*/
if (document.body.dataset.page === "home") {
  const sectionLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const trackedSections = Array.from(document.querySelectorAll(".tracked-section"));

  function setActiveLink(target) {
    sectionLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === target);
    });
  }

  function updateActiveLink() {
    const pageMarker = window.scrollY + 180;
    let currentSection = trackedSections[0];

    trackedSections.forEach((section) => {
      if (section.offsetTop <= pageMarker) currentSection = section;
    });

    /* The final section remains active when the visitor reaches the page bottom. */
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      currentSection = trackedSections[trackedSections.length - 1];
    }

    if (currentSection) setActiveLink(currentSection.dataset.navTarget);
  }

  sectionLinks.forEach((link) => {
    link.addEventListener("click", () => setActiveLink(link.getAttribute("href")));
  });

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("load", updateActiveLink);
  window.addEventListener("hashchange", updateActiveLink);
  updateActiveLink();
}

/* B1.5 HERO SLIDESHOW
This block changes the project photograph every five seconds.
The compact arrow buttons allow visitors to move backward or forward at any time.
After a button is pressed, automatic rotation restarts from that photograph.
To add photographs, copy the <figure class="hero-slide"> block in index.html.
*/
const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));
const previousSlideButton = document.querySelector(".hero-slide-previous");
const nextSlideButton = document.querySelector(".hero-slide-next");

if (heroSlides.length > 1) {
  let activeSlide = 0;
  let slideshowTimer;

  function showSlide(newSlide) {
    heroSlides[activeSlide].classList.remove("active");
    heroSlides[activeSlide].setAttribute("aria-hidden", "true");
    activeSlide = (newSlide + heroSlides.length) % heroSlides.length;
    heroSlides[activeSlide].classList.add("active");
    heroSlides[activeSlide].setAttribute("aria-hidden", "false");
  }

  function startAutomaticSlideshow() {
    window.clearInterval(slideshowTimer);
    slideshowTimer = window.setInterval(() => showSlide(activeSlide + 1), 5000);
  }

  previousSlideButton?.addEventListener("click", () => {
    showSlide(activeSlide - 1);
    startAutomaticSlideshow();
  });

  nextSlideButton?.addEventListener("click", () => {
    showSlide(activeSlide + 1);
    startAutomaticSlideshow();
  });

  startAutomaticSlideshow();
}

/* C6. CONTACT FORM SUBMISSION
This block submits the form without leaving the page and shows a clear result.
Change only the success or error sentence if different wording is required.
*/
const form = document.querySelector(".contact-form");
const formStatus = document.querySelector("#form-status");

if (form && formStatus) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.className = "form-status";
    formStatus.textContent = "Submitting your enquiry…";

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error("Submission failed");

      formStatus.classList.add("success");
      formStatus.textContent = "Thank you. Your enquiry has been submitted successfully.";
      form.reset();
    } catch (error) {
      formStatus.classList.add("error");
      formStatus.textContent = "There was a problem submitting the form. Please email us directly.";
    }
  });
}
