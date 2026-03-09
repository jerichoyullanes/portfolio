/* ============================================
   THEME MANAGEMENT
   ============================================ */
(function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeIcon(theme);
})();

function updateThemeIcon(theme) {
  var icon = document.getElementById("themeIcon");
  if (!icon) return;
  icon.className = theme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
}

function toggleTheme() {
  var current = document.documentElement.getAttribute("data-theme");
  var next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
}

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("themeToggle");
  if (toggle) toggle.addEventListener("click", toggleTheme);

  // Listen for OS theme changes (only if user hasn't manually set preference)
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function (e) {
      if (!localStorage.getItem("theme")) {
        var theme = e.matches ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
        updateThemeIcon(theme);
      }
    });
});

/* ============================================
   HEADER SCROLL EFFECT
   ============================================ */
var lastScrollY = 0;

window.addEventListener("scroll", function () {
  var header = document.getElementById("header");
  var scrollProgress = document.getElementById("scrollProgress");

  // Header glass effect
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 50);
  }

  // Scroll progress bar
  if (scrollProgress) {
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + "%";
  }

  lastScrollY = window.scrollY;
});

/* ============================================
   MOBILE NAVIGATION
   ============================================ */
function toggleMobileNav() {
  var mobileNav = document.getElementById("mobileNav");
  var mobileToggle = document.getElementById("mobileToggle");
  var isOpen = mobileNav.classList.contains("open");

  mobileNav.classList.toggle("open");
  mobileToggle.classList.toggle("active");
  document.body.style.overflow = isOpen ? "" : "hidden";
}

function closeMobileNav() {
  var mobileNav = document.getElementById("mobileNav");
  var mobileToggle = document.getElementById("mobileToggle");
  mobileNav.classList.remove("open");
  mobileToggle.classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", function () {
  var mobileToggle = document.getElementById("mobileToggle");
  if (mobileToggle) mobileToggle.addEventListener("click", toggleMobileNav);

  // Close mobile nav on link click
  var mobileLinks = document.querySelectorAll(".mobile-link");
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", closeMobileNav);
  });
});

/* ============================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================ */
document.addEventListener("DOMContentLoaded", function () {
  var revealElements = document.querySelectorAll(".section .reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything if IntersectionObserver not supported
    revealElements.forEach(function (el) {
      el.classList.add("active");
    });
  }
});

/* ============================================
   ACTIVE NAV SECTION TRACKING
   ============================================ */
document.addEventListener("DOMContentLoaded", function () {
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-link[data-section]");

  function updateActiveNav() {
    var scrollPos = window.scrollY + 150;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove("active");
          if (link.getAttribute("data-section") === id) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();
});

/* ============================================
   CONTACT FORM (EmailJS)
   ============================================ */
var serviceID = "service_m64jjhl";
var templateID = "template_pap5qf1";

function handleSubmit(event) {
  event.preventDefault();

  var btn = document.getElementById("submitBtn");
  var btnText = btn.querySelector(".btn-text");
  var btnLoading = btn.querySelector(".btn-loading");

  // Show loading state
  btnText.style.display = "none";
  btnLoading.style.display = "inline-flex";
  btn.disabled = true;

  var params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  emailjs
    .send(serviceID, templateID, params)
    .then(function () {
      document.getElementById("contactForm").reset();
      showToast(
        "Message sent successfully! I'll get back to you soon.",
        "success",
      );
    })
    .catch(function () {
      showToast("Something went wrong. Please try again later.", "error");
    })
    .finally(function () {
      btnText.style.display = "inline";
      btnLoading.style.display = "none";
      btn.disabled = false;
    });

  return false;
}

/* ============================================
   TOAST NOTIFICATIONS
   ============================================ */
function showToast(message, type) {
  var toast = document.createElement("div");
  toast.className = "toast toast-" + type;

  var iconClass =
    type === "success" ? "fa-check-circle" : "fa-exclamation-circle";
  toast.innerHTML =
    '<i class="fa-solid ' +
    iconClass +
    '"></i><span>' +
    escapeHtml(message) +
    "</span>";

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      toast.classList.add("toast-visible");
    });
  });

  // Auto dismiss
  setTimeout(function () {
    toast.classList.remove("toast-visible");
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 400);
  }, 5000);
}

function escapeHtml(text) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

/* ============================================
   FOOTER YEAR
   ============================================ */
document.addEventListener("DOMContentLoaded", function () {
  var yearEl = document.getElementById("currentYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
