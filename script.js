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
  var toggle = document.getElementById("themeToggle");
  if (toggle)
    toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
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
  if (toggle) {
    toggle.addEventListener("click", toggleTheme);
    updateThemeIcon(document.documentElement.getAttribute("data-theme"));
  }

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
  mobileToggle.setAttribute("aria-expanded", String(!isOpen));
  mobileNav.toggleAttribute("inert", isOpen);
  document.body.style.overflow = isOpen ? "" : "hidden";
}

function closeMobileNav() {
  var mobileNav = document.getElementById("mobileNav");
  var mobileToggle = document.getElementById("mobileToggle");
  mobileNav.classList.remove("open");
  mobileToggle.classList.remove("active");
  mobileToggle.setAttribute("aria-expanded", "false");
  mobileNav.setAttribute("inert", "");
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
var serviceID = "service_cao3jf4";
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
    .catch(function (err) {
      console.error("EmailJS error:", err);
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
  toast.setAttribute("role", type === "error" ? "alert" : "status");
  toast.setAttribute("aria-live", type === "error" ? "assertive" : "polite");

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

/* ============================================
   CERTIFICATE MODAL
   ============================================ */
(function () {
  var modal = document.getElementById("certModal");
  var backdrop = document.getElementById("certModalBackdrop");
  var closeBtn = document.getElementById("certModalClose");
  var modalImg = document.getElementById("certModalImg");
  var modalTitle = document.getElementById("certModalTitle");
  var modalBody = document.getElementById("certModalBody");
  var imgWrap = document.getElementById("certImgWrap");
  var zoomInBtn = document.getElementById("certZoomIn");
  var zoomOutBtn = document.getElementById("certZoomOut");
  var zoomResetBtn = document.getElementById("certZoomReset");
  var zoomLabel = document.getElementById("certZoomLevel");

  var ZOOM_STEP = 0.25;
  var ZOOM_MIN = 0.5;
  var ZOOM_MAX = 3;
  var scale = 1;
  var baseWidth = 0;
  var baseHeight = 0;
  var lastFocusedElement = null;

  /* Compute the 100%-zoom pixel dimensions that fit the container */
  function computeBase() {
    var availW = modalBody.clientWidth;
    var availH = modalBody.clientHeight;
    var natW = modalImg.naturalWidth || 800;
    var natH = modalImg.naturalHeight || 600;
    var fit = Math.min(
      availW / natW,
      availH / natH,
      1,
    ); /* never upscale past natural */
    baseWidth = Math.round(natW * fit);
    baseHeight = Math.round(natH * fit);
  }

  /*
   * Layout strategy (no flexbox centering — that breaks overflow scrolling):
   * - imgWrap is a plain block sized to max(container, image)
   * - image is centered inside imgWrap via equal padding
   * - when image > container: padding = 0, block overflow scrolls in ALL directions
   */
  function applyZoom() {
    if (!baseWidth || !baseHeight) return;

    var imgW = Math.round(baseWidth * scale);
    var imgH = Math.round(baseHeight * scale);
    var availW = modalBody.clientWidth;
    var availH = modalBody.clientHeight;

    var wrapW = Math.max(availW, imgW);
    var wrapH = Math.max(availH, imgH);
    var padX = Math.floor((wrapW - imgW) / 2);
    var padY = Math.floor((wrapH - imgH) / 2);

    imgWrap.style.width = wrapW + "px";
    imgWrap.style.height = wrapH + "px";
    imgWrap.style.padding = padY + "px " + padX + "px";

    modalImg.style.width = imgW + "px";
    modalImg.style.height = imgH + "px";

    zoomLabel.textContent = Math.round(scale * 100) + "%";
    zoomInBtn.disabled = scale >= ZOOM_MAX;
    zoomOutBtn.disabled = scale <= ZOOM_MIN;
  }

  function zoomIn() {
    scale = Math.min(ZOOM_MAX, +(scale + ZOOM_STEP).toFixed(2));
    applyZoom();
  }
  function zoomOut() {
    scale = Math.max(ZOOM_MIN, +(scale - ZOOM_STEP).toFixed(2));
    applyZoom();
  }
  function resetZoom() {
    scale = 1;
    applyZoom();
    modalBody.scrollLeft = 0;
    modalBody.scrollTop = 0;
  }

  function openModal(imgSrc, title) {
    lastFocusedElement = document.activeElement;
    modalImg.src = imgSrc;
    modalImg.alt = title;
    modalTitle.textContent = title;
    scale = 1;
    baseWidth = 0;
    baseHeight = 0;
    /* clear previous layout so old image dimensions don't flash */
    imgWrap.style.cssText = "";
    modalImg.style.cssText = "";
    modal.classList.add("is-open");
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();

    function init() {
      computeBase();
      applyZoom();
      modalBody.scrollLeft = 0;
      modalBody.scrollTop = 0;
    }
    /* onload fires for new images; complete+naturalWidth for cached ones */
    if (modalImg.complete && modalImg.naturalWidth) {
      init();
    } else {
      modalImg.onload = init;
      modalImg.onerror = init; /* fallback so modal isn't broken on error */
    }
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.hidden = true;
    document.body.style.overflow = "";
    modalImg.onload = null;
    modalImg.src = "";
    scale = 1;
    baseWidth = 0;
    baseHeight = 0;
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function trapFocus(e) {
    if (e.key !== "Tab") return;
    var focusable = modal.querySelectorAll(
      'button:not([disabled]), [tabindex="0"]',
    );
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* Scroll-wheel zoom */
  modalBody.addEventListener(
    "wheel",
    function (e) {
      if (!modal.classList.contains("is-open")) return;
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    },
    { passive: false },
  );

  /* Drag-to-pan when zoomed in */
  var isDragging = false,
    startX = 0,
    startY = 0,
    scrollLeft = 0,
    scrollTop = 0;

  modalBody.addEventListener("mousedown", function (e) {
    if (scale <= 1) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    scrollLeft = modalBody.scrollLeft;
    scrollTop = modalBody.scrollTop;
    modalBody.classList.add("is-dragging");
    e.preventDefault();
  });

  window.addEventListener("mouseup", function () {
    if (isDragging) {
      isDragging = false;
      modalBody.classList.remove("is-dragging");
    }
  });

  window.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    e.preventDefault();
    modalBody.scrollLeft = scrollLeft - (e.clientX - startX);
    modalBody.scrollTop = scrollTop - (e.clientY - startY);
  });

  /* Zoom button clicks */
  zoomInBtn.addEventListener("click", zoomIn);
  zoomOutBtn.addEventListener("click", zoomOut);
  zoomResetBtn.addEventListener("click", resetZoom);

  /* Card click */
  document.addEventListener("click", function (e) {
    var card = e.target.closest(".cert-card--clickable");
    if (card) openModal(card.dataset.certImg, card.dataset.certTitle);
  });

  /* Keyboard */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      var card = e.target.closest(".cert-card--clickable");
      if (card) {
        e.preventDefault();
        openModal(card.dataset.certImg, card.dataset.certTitle);
      }
    }
    if (modal.classList.contains("is-open")) {
      trapFocus(e);
      if (e.key === "Escape") closeModal();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);
})();
