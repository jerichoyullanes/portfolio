function downloadCV () {
    window.location.href = "https://drive.google.com/uc?id=1OpIWHB-Z_6o1cvLLSW3EpW-eAgdjtSUk&export=download";
}

function mobileNav() {
    var x = document.getElementById("mobile-nav");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
}

function href(link) {
  window.open(`${link}`, "_blank");
}

const serviceID = "service_m64jjhl";
const templateID = "template_pap5qf1";

function sendEmail() {
  var params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  emailjs.send(serviceID,templateID,params)
    .then(
      res => {
        document.getElementById("name").value = "",
        document.getElementById("email").value = "",
        document.getElementById("subject").value = "",
        document.getElementById("message").value = "",
        console.log(res);
        // alert("your email sent successfully");
        Swal.fire({
          title: "Email Sent!",
          text: "Your email is successfully sent!",
          icon: "success"
        });
      }
    )
    .catch((err) => console.log(err));
}

