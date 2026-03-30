(function () {
    if (typeof emailjs !== "undefined") {
        emailjs.init("f1JhtpwLyEqcWoE-1");
    }
})();
function hideAll() {
    var ids = ["loginBox", "registerBox", "forgotBox"];
    ids.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
}

function showRegister() { hideAll(); document.getElementById("registerBox").style.display = "block"; }
function showLogin()    { hideAll(); document.getElementById("loginBox").style.display    = "block"; }
function showForgot()   { hideAll(); document.getElementById("forgotBox").style.display   = "block"; }

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function hashPassword(password) {
    return btoa(encodeURIComponent(password));
}

function isOTPExpired(timestampKey) {
    var timestamp = sessionStorage.getItem(timestampKey);
    if (!timestamp) return true;
    return (Date.now() - parseInt(timestamp)) > 5 * 60 * 1000;
}
function compressImage(dataURL, callback) {
    var img = new Image();
    img.onload = function () {
        var canvas = document.createElement("canvas");
        var MAX = 400;
        var w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; } }
        else       { if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; } }
        canvas.width  = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.src = dataURL;
}

function previewPhoto(event) {
    var file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file!");
        event.target.value = "";
        return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
        compressImage(e.target.result, function (compressed) {
            sessionStorage.setItem("tempPhoto", compressed);
            document.getElementById("photoPreview").src = compressed;
            document.getElementById("photoPreviewContainer").style.display = "block";
            document.getElementById("uploadText").textContent = "✅ " + file.name;
        });
    };
    reader.readAsDataURL(file);
}
function register() {
    var username = document.getElementById("regUser").value.trim();
    var password = document.getElementById("regPass").value.trim();
    var email    = document.getElementById("regEmail").value.trim();
    var phone    = document.getElementById("regPhone").value.trim();
    var gender   = document.getElementById("reggender").value.trim();
    var dob      = document.getElementById("regdob").value.trim();
    var cast     = document.getElementById("regcast").value.trim();
    var salary   = document.getElementById("regsalary").value.trim();
    var fname    = document.getElementById("regfname").value.trim();
    var mname    = document.getElementById("regmname").value.trim();
    var bio      = document.getElementById("regbio").value.trim();

    if (!username || !password || !email || !phone) {
        alert("Please fill all required fields (Username, Password, Email, Phone)");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters!");
        return;
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Invalid email address!");
        return;
    }
    var digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
        alert("Invalid phone number! Must be at least 10 digits.");
        return;
    }
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        try {
            var existing = JSON.parse(localStorage.getItem(key));
            if (existing && existing.username &&
                existing.username.toLowerCase() === username.toLowerCase()) {
                alert("Username already taken!");
                return;
            }
        } catch(e) {}
    }

    var otp = generateOTP();
    sessionStorage.setItem("otp", otp);
    sessionStorage.setItem("otpTimestamp", Date.now().toString());
    sessionStorage.setItem("tempUser", JSON.stringify({
        username : username,
        password : hashPassword(password),
        email    : email,
        phone    : phone,
        gender   : gender,
        dob      : dob,
        cast     : cast,
        salary   : salary,
        fname    : fname,
        mname    : mname,
        bio      : bio,
        photo    : sessionStorage.getItem("tempPhoto") || ""
    }));

    emailjs.send("service_rxlq9zm", "template_s4p4mx9", {
        to_email : email,
        otp      : otp
    })
    .then(function () {
        alert("OTP sent to your email!");
        document.getElementById("otpSection").style.display = "block";
        document.getElementById("otpInput").focus();
    })
    .catch(function (error) {
        alert("Error sending OTP. Please try again.");
        console.error(error);
    });
}

function verifyOTP() {
    var enteredOTP = document.getElementById("otpInput").value.trim();
    var storedOTP  = sessionStorage.getItem("otp");
    if (!storedOTP) {
        alert("No OTP found. Please register again.");
        return;
    }

    if (isOTPExpired("otpTimestamp")) {
        alert("OTP has expired! Please register again.");
        sessionStorage.clear();
        document.getElementById("otpSection").style.display = "none";
        return;
    }

    if (enteredOTP === storedOTP) {
        var tempUser = JSON.parse(sessionStorage.getItem("tempUser"));

        try {
            localStorage.setItem(tempUser.username, JSON.stringify(tempUser));
        } catch (e) {
            tempUser.photo = "";
            localStorage.setItem(tempUser.username, JSON.stringify(tempUser));
            alert("Profile photo was too large to save, but registration succeeded!");
        }

        sessionStorage.clear();
        alert("Registration successful!");
        showLogin();
    } else {
        alert("Invalid OTP!");
    }
}

/* ── Login ── */
function login() {
    var username = document.getElementById("logUser").value.trim();
    var password = document.getElementById("logPass").value.trim();
    if (!username || !password) {
        alert("Please enter both username and password!");
        return;
    }
    var storedUser = null;
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        try {
            var u = JSON.parse(localStorage.getItem(key));
            if (u && u.username && u.username.toLowerCase() === username.toLowerCase()) {
                storedUser = u;
                break;
            }
        } catch(e) {}
    }

    if (!storedUser) {
        alert("User not found!");
        return;
    }

    if (storedUser.password === hashPassword(password)) {
        sessionStorage.setItem("loggedInUser", storedUser.username);
        window.location.href = "home.html";
    } else {
        alert("Invalid password!");
    }
}

function sendResetOTP() {
    var username = document.getElementById("forgotUser").value.trim();
    var email    = document.getElementById("forgotEmail").value.trim();

    if (!username || !email) {
        alert("Please enter both username and email!");
        return;
    }
    var userData = null;
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        try {
            var u = JSON.parse(localStorage.getItem(key));
            if (u && u.username && u.username.toLowerCase() === username.toLowerCase()) {
                userData = u;
                break;
            }
        } catch(e) {}
    }

    if (!userData) {
        alert("User not found!");
        return;
    }

    if (userData.email.toLowerCase() !== email.toLowerCase()) {
        alert("Email does not match!");
        return;
    }

    var otp = generateOTP();
    sessionStorage.setItem("resetOtp", otp);
    sessionStorage.setItem("resetOtpTimestamp", Date.now().toString());
    sessionStorage.setItem("resetUser", userData.username);

    emailjs.send("service_rxlq9zm", "template_s4p4mx9", {
        to_email : email,
        otp      : otp
    })
    .then(function () {
        alert("OTP sent to your email!");
        document.getElementById("forgotOtpSection").style.display = "block";
    })
    .catch(function () {
        alert("Failed to send OTP. Please try again.");
    });
}

function verifyResetOTP() {
    var enteredOtp  = document.getElementById("forgotOtpInput").value.trim();
    var newPassword = document.getElementById("newPass").value.trim();

    if (!enteredOtp || !newPassword) {
        alert("Please fill in both OTP and new password!");
        return;
    }

    if (newPassword.length < 6) {
        alert("Password must be at least 6 characters!");
        return;
    }

    if (isOTPExpired("resetOtpTimestamp")) {
        alert("OTP has expired! Please request a new one.");
        sessionStorage.removeItem("resetOtp");
        sessionStorage.removeItem("resetOtpTimestamp");
        document.getElementById("forgotOtpSection").style.display = "none";
        return;
    }

    var storedOtp = sessionStorage.getItem("resetOtp");
    var username  = sessionStorage.getItem("resetUser");
    if (!storedOtp || !username) {
        alert("Session expired. Please start the reset process again.");
        showForgot();
        return;
    }

    if (enteredOtp !== storedOtp) {
        alert("Invalid OTP!");
        return;
    }

    var userData = JSON.parse(localStorage.getItem(username));
    if (!userData) {
        alert("User data not found. Please contact support.");
        return;
    }

    userData.password = hashPassword(newPassword);
    localStorage.setItem(username, JSON.stringify(userData));

    sessionStorage.clear();
    alert("Password reset successful!");
    showLogin();
}

function logout() {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}