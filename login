<!doctype html>
<html>

<head>
    <title>Login & Register</title>
    <link rel="stylesheet" href="backcss.css">
    <script src="backjs.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js">
    </script>
    <script>
        (function () {
            emailjs.init("f1JhtpwLyEqcWoE-1");
        })();
    </script>

</head>

<body>
    <div class="header">
        <h2>SYNC SOUL</h2>
        <p><i>Find Your Soulmate</i></p>
    </div>
    <canvas id="matrixCanvas"></canvas>
    <div class="box" id="loginBox">
        <h2>Login</h2>
        <input type="text" id="logUser" placeholder="Username">
        <input type="password" id="logPass" placeholder="Password">
        <button onclick="login()">Login</button>
        <div class="switch" onclick="showForgot()">Forgot Password?</div>
        <div class="switch" onclick="showRegister()">Create New Account</div>
    </div>
    <div class="box" id="registerBox" style="display:none;">
        <h2>Create Account</h2>

        <input type="text" id="regUser" placeholder="Username">
        <input type="text" id="reggender" placeholder="Gender">
        <input type="password" id="regPass" placeholder="Password">
        <input type="email" id="regEmail" placeholder="Email">
        <input type="tel" id="regPhone" placeholder="Phone Number">
        <input type="date" id="regdob">
        <input type="text" id="regcast" placeholder="Cast">
        <input type="number" id="regsalary" placeholder="Salary">
        <input type="text" id="regfname" placeholder="Father's name">
        <input type="text" id="regmname" placeholder="Mother's name">
        <textarea id="regbio" rows="4" cols="30" placeholder="Bio"></textarea>

        <button onclick="register()">Register</button>

        <div id="otpSection" style="display:none;">
            <input type="text" id="otpInput" placeholder="Enter OTP">
            <button onclick="verifyOTP()">Verify OTP</button>
        </div>

        <div class="switch" onclick="showLogin()">Already have an account?</div>
    </div>
    <div class="box" id="forgotBox" style="display:none;">
        <h2>Reset Password</h2>

        <input type="text" id="forgotUser" placeholder="Username">
        <input type="email" id="forgotEmail" placeholder="Registered Email">
        <button onclick="sendResetOTP()">Send OTP</button>

        <div id="forgotOtpSection" style="display:none;">
            <input type="text" id="forgotOtpInput" placeholder="Enter OTP">
            <input type="password" id="newPass" placeholder="New Password">
            <button onclick="verifyResetOTP()">Verify & Reset</button>
        </div>

        <div class="switch" onclick="showLogin()">Back to Login</div>
    </div>

</body>

</html>
