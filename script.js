document.addEventListener('DOMContentLoaded', () => {
    // Registration form validation
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', (event) => {
            const dob = document.getElementById('dob').value; // Use Date of Birth instead of Age
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Date of Birth validation (example: ensure user is at least 1 year old)
            const dobDate = new Date(dob);
            const today = new Date();
            const age = today.getFullYear() - dobDate.getFullYear();
            if (age < 1 || isNaN(dobDate)) {
                alert('Please enter a valid Date of Birth.');
                event.preventDefault(); // Prevent form submission
            }

            // Phone number validation
            const phoneRegex = /^[0-9]{10}$/; // Ensure it's a 10-digit number
            if (!phoneRegex.test(phone)) {
                alert('Please enter a valid 10-digit phone number.');
                event.preventDefault();
            }

            // Password and confirm password validation
            if (password !== confirmPassword) {
                alert('Passwords do not match! Please try again.');
                event.preventDefault(); // Prevent form submission
            }

            // Password length validation
            if (password.length < 6) {
                alert('Password must be at least 6 characters long.');
                event.preventDefault(); // Prevent form submission
            }

            const medicalAllergiesDropdown = document.getElementById('medicalAllergies');
            const otherMedicalAllergyInput = document.getElementById('otherMedicalAllergy');
            if (medicalAllergiesDropdown.value === 'Other') {
                otherMedicalAllergyInput.style.display = 'block';
            } else {
                otherMedicalAllergyInput.style.display = 'none';
            }
        });
    }

    // Login form validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            // Check for empty fields
            if (!username) {
                alert('Please enter your username.');
                event.preventDefault(); // Prevent form submission
            }

            if (!password) {
                alert('Please enter your password.');
                event.preventDefault(); // Prevent form submission
            }
        });
    }

    // Records functionality
    const createNewRecordButton = document.querySelector('.new-record-btn');
    if (createNewRecordButton) {
        createNewRecordButton.addEventListener('click', () => {
            // Redirect to the create record page
            window.location.href = '/create-record';
        });
    }

    // View and Delete buttons functionality (example)
    const viewButtons = document.querySelectorAll('.view-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    viewButtons.forEach((button) => {
        button.addEventListener('click', () => {
            alert('View record functionality to be implemented.');
        });
    });

    deleteButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const confirmation = confirm('Are you sure you want to delete this record?');
            if (confirmation) {
                alert('Delete record functionality to be implemented.');
            }
        });
    });

    document.getElementById('getTemperature').addEventListener('click', () => {
        fetchMeasurement('temperature', 'temperature');
    });

    document.getElementById('getWeight').addEventListener('click', () => {
        fetchMeasurement('weight', 'weight');
    });

    document.getElementById('getOxygenLevel').addEventListener('click', () => {
        fetchMeasurement('oxygenLevel', 'oxygenLevel');
    });

    document.getElementById('getPulseRate').addEventListener('click', () => {
        fetchMeasurement('pulseRate', 'pulseRate');
    });

    // Form validation
    const form = document.getElementById('measurementForm');
    form.addEventListener('submit', (event) => {
        const temperature = document.getElementById('temperature').value;
        const weight = document.getElementById('weight').value;
        const oxygenLevel = document.getElementById('oxygenLevel').value;
        const pulseRate = document.getElementById('pulseRate').value;

        if (!temperature || !weight || !oxygenLevel || !pulseRate) {
            alert('All measurements are required to be taken before submitting the form.');
            event.preventDefault(); // Prevent form submission
        }
    });

    // Function to fetch measurement data from the server
    async function fetchMeasurement(endpoint, fieldId) {
        try {
            const response = await fetch(`/get_measurement/${endpoint}`);
            if (!response.ok) {
                throw new Error(`Error fetching measurement: ${response.statusText}`);
            }

            const data = await response.json();
            const inputField = document.getElementById(fieldId);
            inputField.value = data.measurement;
        } catch (error) {
            console.error(error);
            alert('Failed to fetch measurement.');
        }
    }
});
