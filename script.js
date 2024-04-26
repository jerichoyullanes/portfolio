function downloadCV () {
    window.location.href = "https://drive.google.com/uc?id=1OpIWHB-Z_6o1cvLLSW3EpW-eAgdjtSUk&export=download";
}

function mobileNav() {
    console.log("TEST");
    var x = document.getElementById("mobile-nav");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
}