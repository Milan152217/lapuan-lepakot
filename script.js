
// Lapuan Lepakot ry
// Exercise E3 - JavaScript

console.log("Lapuan Lepakot JavaScript is working");


// ========================================
// 1. Match filtering
// ========================================

const filterButtons = document.querySelectorAll("[data-filter]");
const matchRows = document.querySelectorAll("#match-table tbody tr");
const matchStatus = document.querySelector("#match-status");

if (matchStatus) {

    function filterMatches(selectedTeam) {

        let visibleCount = 0;

        // Filter matches
        for (const row of matchRows) {

            const matchesTeam =
                selectedTeam === "all" ||
                row.dataset.team === selectedTeam;

            row.hidden = !matchesTeam;

            if (matchesTeam) {
                visibleCount++;
            }
        }

        // Update selected button
        for (const button of filterButtons) {

            button.setAttribute(
                "aria-pressed",
                String(button.dataset.filter === selectedTeam)
            );
        }

        // Update result counter
        matchStatus.textContent =
            `Showing ${visibleCount} of ${matchRows.length} matches`;
    }


    // ========================================
    // 2. LocalStorage
    // ========================================

    let savedTeam = "all";

    try {
        savedTeam = localStorage.getItem("selectedTeam") || "all";
    } catch (error) {
        console.warn("LocalStorage is unavailable.");
    }

    // Check that the saved filter is valid
    const validTeams = ["all", "men", "women", "juniors"];

    if (!validTeams.includes(savedTeam)) {
        savedTeam = "all";
    }

    // Restore saved filter
    filterMatches(savedTeam);

    // Filter button click events
    for (const button of filterButtons) {

        button.addEventListener("click", () => {

            const selectedTeam = button.dataset.filter;

            filterMatches(selectedTeam);

            // Save selected team
            try {
                localStorage.setItem("selectedTeam", selectedTeam);
            } catch (error) {
                console.warn("Could not save the selected team.");
            }
        });
    }
}


// ========================================
// 3. Registration form validation
// ========================================

const registrationForm = document.querySelector("#registration-form");

if (registrationForm) {

    const nameInput = document.querySelector("#name");
    const emailInput = document.querySelector("#email");
    const teamInput = document.querySelector("#team");
    const formStatus = document.querySelector("#form-status");
    const submitButton = document.querySelector("#submit-registration");

    // Enable custom JavaScript validation
    registrationForm.noValidate = true;

    // Display an error message
    function showError(input, message) {

        const error = document.querySelector(`#${input.id}-error`);

        error.textContent = message;

        input.setAttribute("aria-invalid", "true");
    }

    // Remove an error message
    function clearError(input) {

        const error = document.querySelector(`#${input.id}-error`);

        error.textContent = "";

        input.removeAttribute("aria-invalid");
    }

    // Check registration
    registrationForm.addEventListener("submit", (event) => {

        event.preventDefault();

        let firstInvalid = null;

        // Clear previous errors
        clearError(nameInput);
        clearError(emailInput);
        clearError(teamInput);

        formStatus.textContent = "";
        formStatus.classList.remove("success-message");

        // Validate name
        if (nameInput.value.trim().length < 2) {

            showError(nameInput, "Please enter your full name.");

            firstInvalid = nameInput;
        }

        // Validate email
        if (emailInput.value.trim() === "" ||
            !emailInput.validity.valid) {

            showError(emailInput, "Please enter a valid email address.");

            if (!firstInvalid) {
                firstInvalid = emailInput;
            }
        }

        // Validate team
        if (teamInput.value === "") {

            showError(teamInput, "Please select a team.");

            if (!firstInvalid) {
                firstInvalid = teamInput;
            }
        }

        // Focus on the first invalid field
        if (firstInvalid) {

            formStatus.textContent =
                "Please correct the highlighted fields.";

            firstInvalid.focus();

            return;
        }

        // Registration is ready
        formStatus.textContent =
            "Your registration is ready. No information has been sent to the club.";

        formStatus.classList.add("success-message");
    });

    // Clear messages when the user edits the form
    registrationForm.addEventListener("input", (event) => {

        if ([nameInput, emailInput, teamInput].includes(event.target)) {

            clearError(event.target);
        }

        formStatus.textContent = "";

        formStatus.classList.remove("success-message");
    });

    // Enable registration button
    submitButton.disabled = false;
}
