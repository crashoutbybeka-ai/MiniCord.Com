// @ts-nocheck
const Input = document.getElementById("nameField");
const btn = document.getElementById("submit_name");
const blacklist = ["Epstein", "epstein", "Diddy", "diddy", "daddy", "Daddy", "Niger", "niger", "Niggas", "niggas", "Fuck", "fuck"];

function handleCredentialResponse(response) {
    const payload = JSON.parse(
        atob(response.credential.split(".")[1])
    );

    const user = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        googleId: payload.sub
    };

    localStorage.setItem("user", JSON.stringify(user));

    // Show loading screen
    document.getElementById("loadingScreen").style.display = "flex";

    // Simulate loading or wait for server verification
    setTimeout(() => {
        window.location.href = "../Pages/server_selection.html";
    }, 1500);
}

// Check for existing login
const savedUser = JSON.parse(
    localStorage.getItem("user")
);

if (savedUser) {
    console.log(
        `Already signed in as ${savedUser.name}`
    );
}