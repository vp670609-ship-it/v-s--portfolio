// =====================================
// PROFILE POPUP AND EDIT FUNCTIONALITY
// =====================================

const profileModal = document.getElementById("profile-modal");
const profileClose = document.getElementById("profile-close");
const profileView = document.getElementById("profile-view");
const profileEditForm = document.getElementById("profile-edit-form");

const editProfileBtn = document.getElementById("edit-profile-btn");
const cancelProfileEdit = document.getElementById("cancel-profile-edit");

const profileFields = {
    name: document.getElementById("edit-name"),
    course: document.getElementById("edit-course"),
    email: document.getElementById("edit-email"),
    skills: document.getElementById("edit-skills"),
    about: document.getElementById("edit-about")
};

const defaultProfile = {
    name: "VANUMU VENKATESH",
    course: "B.Tech CSE — AI & Machine Learning",
    email: "vp670609@gmail.com",
    skills: "Python, HTML, CSS, JavaScript, AI fundamentals",
    about: "First-year B.Tech student learning programming and AI/ML.",
    picture: "profile.jpg2.jpeg"
};

let profileData = { ...defaultProfile };

try {
    const savedProfile = localStorage.getItem("vvPortfolioProfile");
    if (savedProfile) {
        profileData = { ...defaultProfile, ...JSON.parse(savedProfile) };
    }
} catch (error) {
    console.warn("Could not load saved profile.", error);
}

// Update popup and profile images
function displayProfile() {
    document.getElementById("popup-profile-name").textContent = profileData.name;
    document.getElementById("popup-profile-course").textContent = profileData.course;
    document.getElementById("popup-profile-email").textContent = profileData.email;
    document.getElementById("popup-profile-skills").textContent = profileData.skills;
    document.getElementById("popup-profile-about").textContent = profileData.about;
    document.getElementById("popup-profile-image").src = profileData.picture;

    document.querySelectorAll(
        ".profile-image, .nav-profile img, img.nav-profile"
    ).forEach(img => {
        img.src = profileData.picture;
        img.alt = "Profile picture of " + profileData.name;
    });
}

// Open popup when profile picture is clicked
document.querySelectorAll(
    ".profile-image, .nav-profile img, img.nav-profile"
).forEach(img => {
    img.addEventListener("click", () => {
        displayProfile();
        profileView.hidden = false;
        profileEditForm.hidden = true;
        profileModal.classList.add("active");
        profileModal.setAttribute("aria-hidden", "false");
    });
});

// Close popup
function closeProfileModal() {
    profileModal.classList.remove("active");
    profileModal.setAttribute("aria-hidden", "true");
}

profileClose.addEventListener("click", closeProfileModal);

profileModal.addEventListener("click", event => {
    if (event.target === profileModal) closeProfileModal();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeProfileModal();
});

// Open edit form
editProfileBtn.addEventListener("click", () => {
    Object.keys(profileFields).forEach(key => {
        profileFields[key].value = profileData[key];
    });

    profileView.hidden = true;
    profileEditForm.hidden = false;
});

// Cancel editing
cancelProfileEdit.addEventListener("click", () => {
    profileEditForm.hidden = true;
    profileView.hidden = false;
});

// Save profile details
profileEditForm.addEventListener("submit", event => {
    event.preventDefault();

    const updatedProfile = {};

    Object.keys(profileFields).forEach(key => {
        updatedProfile[key] = profileFields[key].value.trim();
    });

    const pictureInput = document.getElementById("edit-picture");
    const selectedFile = pictureInput.files[0];

    function saveProfile(picture) {
        profileData = {
            ...profileData,
            ...updatedProfile,
            picture
        };

        try {
            localStorage.setItem(
                "vvPortfolioProfile",
                JSON.stringify(profileData)
            );

            displayProfile();
            profileEditForm.hidden = true;
            profileView.hidden = false;

            alert("Your profile has been updated!");
        } catch (error) {
            alert("Could not save your profile. Try using a smaller image.");
        }
    }

    if (selectedFile) {
        if (!selectedFile.type.startsWith("image/")) {
            alert("Please select a valid image.");
            return;
        }

        if (selectedFile.size > 2 * 1024 * 1024) {
            alert("Please choose an image smaller than 2 MB.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => saveProfile(reader.result);
        reader.onerror = () => alert("Could not read that image.");

        reader.readAsDataURL(selectedFile);
    } else {
        saveProfile(profileData.picture);
    }
});

// Load saved details when the page starts
displayProfile();