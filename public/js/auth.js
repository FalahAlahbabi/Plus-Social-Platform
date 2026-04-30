const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("signupPassword");
const passwordStrengthEl = document.getElementById("passwordStrength");

function saveCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}

function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { label: "Weak – add uppercase, numbers & symbols", cls: "strength-weak" };
    if (score <= 2) return { label: "Medium – add more variety", cls: "strength-medium" };
    if (score === 3) return { label: "Good", cls: "strength-good" };
    return { label: "Strong", cls: "strength-strong" };
}

if (passwordInput && passwordStrengthEl) {
    passwordInput.addEventListener("input", function () {
        const val = passwordInput.value;
        if (!val) {
            passwordStrengthEl.textContent = "";
            passwordStrengthEl.className = "password-strength";
            return;
        }

        const result = getPasswordStrength(val);
        passwordStrengthEl.textContent = "Strength: " + result.label;
        passwordStrengthEl.className = "password-strength " + result.cls;
    });
}

if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("signupUsername").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value.trim();
        const bio = document.getElementById("signupBio").value.trim();

        const selectedAvatarInput = document.querySelector('input[name="profilePicture"]:checked');
        const profilePicture = selectedAvatarInput
            ? selectedAvatarInput.value
            : "/assets/images/default-avatar.png";

        const strength = getPasswordStrength(password);
        if (strength.cls === "strength-weak") {
            const continueWeak = confirm(
                "Your password is weak. It's better to use at least 8 characters, one uppercase letter, one number, and one symbol.\n\nDo you want to continue anyway?"
            );

            if (!continueWeak) {
                return;
            }
        }

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    bio,
                    profilePicture,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Could not create account.");
                return;
            }

            alert("Account created successfully!");
            window.location.href = "/Html/login.html";
        } catch (error) {
            console.error("Signup error:", error);
            alert("Something went wrong while creating the account.");
        }
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Invalid email or password.");
                return;
            }

            saveCurrentUser(data);

            alert("Login successful!");
            window.location.href = "/Html/feed.html";
        } catch (error) {
            console.error("Login error:", error);
            alert("Something went wrong while logging in.");
        }
    });
}