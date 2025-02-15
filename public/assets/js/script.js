function loadLayout() {
    loadHeader(); // Assuming Pug includes header dynamically
    loadFooter(); // Assuming Pug includes footer dynamically
}

// Theme Toggle Functionality
function addThemeToggleListener() {
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const theme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
            setTheme(theme);
        });
    }
}

function setTheme(theme) {
    const toggleButton = document.getElementById('theme-toggle');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        if (toggleButton) {
            toggleButton.textContent = '☀️';
            toggleButton.setAttribute('aria-label', 'Switch to Light Mode');
        }
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        if (toggleButton) {
            toggleButton.textContent = '🌙';
            toggleButton.setAttribute('aria-label', 'Switch to Dark Mode');
        }
    }
    localStorage.setItem('theme', theme);
}

// Handle registration form submission
document.getElementById('registerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect form data
    const formData = {
        name: document.getElementById('reg-name').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        password: document.getElementById('reg-password').value, // Note: Storing passwords in localStorage is insecure
        phone: document.getElementById('reg-phone').value.trim(),
        age: document.getElementById('reg-age').value.trim(),
        gender: document.querySelector('input[name="gender"]:checked')?.value || 'Not specified'
    };

    // Basic Validation (optional enhancement)
    if (!validateFormData(formData)) {
        alert('Please fill out all required fields correctly.');
        return;
    }

    // Store form data in localStorage
    localStorage.setItem('registrationData', JSON.stringify(formData));
    localStorage.setItem('username', formData.name);

    // Optionally, reset the form after submission
    document.getElementById('registerForm').reset();

    // Redirect to the thankyou page (with Pug, assuming the route is /thankyou)
    window.location.href = '/thankyou';
});

// Basic form data validation function (optional)
function validateFormData(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!data.name || !data.email || !data.password || !data.phone || !data.age || !data.gender) {
        return false;
    }

    if (!emailRegex.test(data.email)) {
        return false;
    }

    if (!phoneRegex.test(data.phone)) {
        return false;
    }

    const age = parseInt(data.age, 10);
    if (isNaN(age) || age < 13 || age > 120) {
        return false;
    }

    return true;
}

// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const registrationData = JSON.parse(localStorage.getItem('registrationData'));

    if (registrationData && registrationData.email === email && registrationData.password === password) {
        localStorage.setItem('username', registrationData.name);

        // Redirect to the dashboard page after login (with Pug, assuming the route is /dashboard)
        window.location.href = '/dashboard';
    } else {
        alert('Invalid email or password.');
    }
});

// Dashboard functionality
const codeEditor = document.getElementById('codeEditor');
const outputBox = document.getElementById('output');
const chatroomBtn = document.getElementById('chatroomBtn');

// Handle the "New File" button
document.getElementById('newFile')?.addEventListener('click', function() {
    if (confirm('Are you sure you want to create a new file? Unsaved changes will be lost.')) {
        if (codeEditor) codeEditor.value = '';
        if (outputBox) outputBox.textContent = 'Output will appear here...';
    }
});

// Handle the "Save File" button
document.getElementById('saveFile')?.addEventListener('click', function() {
    const fileName = prompt('Enter a name for your file:', 'code.txt');
    if (fileName) {
        const blob = new Blob([codeEditor.value], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        alert('File saved as ' + fileName);
    }
});

// Handle the "Open File" button
document.getElementById('openFile')?.addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.js,.html,.css,.c,.cpp';
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                codeEditor.value = e.target.result;
            };
            reader.readAsText(file);
        }
    };
    input.click();
});

// Handle the "Delete File" button
document.getElementById('deleteFile')?.addEventListener('click', function() {
    if (confirm('Are you sure you want to delete the current file?')) {
        if (codeEditor) codeEditor.value = '';
        if (outputBox) outputBox.textContent = 'Output will appear here...';
    }
});

// Handle the "Run Code" button
document.getElementById('runCode')?.addEventListener('click', function() {
    runCode();
});

// Handle the "Download ZIP" button
document.getElementById('downloadCode')?.addEventListener('click', function() {
    const zip = new JSZip();
    const fileName = prompt('Enter a name for your ZIP file:', 'code.zip');
    if (fileName) {
        zip.file('code.txt', codeEditor.value);
        zip.generateAsync({ type: 'blob' }).then(function(content) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = fileName;
            link.click();
            alert('ZIP file downloaded as ' + fileName);
        });
    }
});

// Handle the "Chatroom" button
if (chatroomBtn) {
    chatroomBtn.addEventListener('click', function() {
        window.location.href = '/chatroom'; // Navigate to chatroom.pug (assuming the route is set up)
    });
}

// Function to simulate running code
// function runCode() {
//     const code = codeEditor.value;
//     if (outputBox) {
//         if (code.trim().length === 0) {
//             outputBox.innerHTML = "<p style='color: red;'>Please enter some code!</p>";
//         } else if (code.includes("print") || code.includes("System.out.println")) {
//             let output = "Simulated Output: ";
//             const match = code.match(/"(.*?)"/);
//             if (match) {
//                 output += sanitizeHTML(match[1]);
//             } else {
//                 output += "No output found.";
//             }
//             outputBox.innerHTML = `<p style='color: green;'>${output}</p>`;
//         } else if (code.toLowerCase().includes("python")) {
//             outputBox.innerHTML = "<p style='color: green;'>Python Code Detected!</p>";
//         } else if (code.toLowerCase().includes("java")) {
//             outputBox.innerHTML = "<p style='color: green;'>Java Code Detected!</p>";
//         } else if (code.toLowerCase().includes("c++")) {
//             outputBox.innerHTML = "<p style='color: green;'>C++ Code Detected!</p>";
//         } else if (code.toLowerCase().includes("c")) {
//             outputBox.innerHTML = "<p style='color: green;'>C Code Detected!</p>";
//         } else {
//             outputBox.innerHTML = "<p style='color: blue;'>Code detected, but no specific action taken!</p>";
//         }
//     }
// }
async function runCode() {
    const code = codeEditor.value;
    if (outputBox) {
        if (code.trim().length === 0) {
            outputBox.innerHTML = "<p style='color: red;'>Please enter some code!</p>";
            return;
        }

        // Prepare the request payload
        const requestBody = {
            "language": "c", // Correct key for Piston API
            "version": "c11", // Use C11 standard
            "files": [{ "name": "main.c", "content": code }]
        };

        try {
            // Make the API call
            const response = await axios.post('https://emkc.org/api/v2/piston/execute', requestBody);
            const output = response.data.output; // Get the output from the response

            // Check for errors in the response
            if (response.data.errors) {
                outputBox.innerHTML = `<p style='color: red;'>Error: ${sanitizeHTML(response.data.errors)}</p>`;
                return;
            }

            // Display the output in the output box
            if (output) {
                outputBox.innerHTML = `<p style='color: green;'>Output: ${sanitizeHTML(output)}</p>`;
            } else {
                outputBox.innerHTML = "<p style='color: blue;'>No output generated.</p>";
            }
        } catch (error) {
            console.error('Error executing code:', error);
            outputBox.innerHTML = "<p style='color: red;'>Error running code. Please try again later.</p>";
        }
    }
}


// Function to display registration data on thankyou.html
function displayThankYouData() {
    const dataContainer = document.getElementById('registrationData');
    const registrationData = JSON.parse(localStorage.getItem('registrationData'));

    if (dataContainer && registrationData) {
        dataContainer.innerHTML = `
            <h2>Registration Details:</h2>
            <ul>
                <li><strong>Name:</strong> ${sanitizeHTML(registrationData.name)}</li>
                <li><strong>Email:</strong> ${sanitizeHTML(registrationData.email)}</li>
                <li><strong>Phone:</strong> ${sanitizeHTML(registrationData.phone)}</li>
                <li><strong>Age:</strong> ${sanitizeHTML(registrationData.age)}</li>
                <li><strong>Gender:</strong> ${sanitizeHTML(registrationData.gender)}</li>
            </ul>
        `;
    }
}

// Function to handle logout (can be reused if needed)
function logout() {
    // Clear user data from localStorage
    localStorage.removeItem('username');
    // Optionally, clear other user-related data
    // Redirect to homepage
    window.location.href = './index';
}

// Function to handle "Forgot Password" link click
function addForgotPasswordListener() {
    // Option 1: Using class selector
    const forgotPasswordLink = document.querySelector('.forgot');
    // Option 2: Using id selector (uncomment if using Option 2)
    // const forgotPasswordLink = document.getElementById('forgotPassword');

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            alert('A password reset link has been sent to your email.');
            // In a real application, trigger the password reset process here
        });
    }
}

// Function to display registration data safely
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Event listener for DOMContentLoaded to load header and footer and initialize functionalities
document.addEventListener('DOMContentLoaded', function() {
    loadLayout();

    // If on the thankyou.html page, display the registration data
    if (window.location.pathname.endsWith('./thankyou')) {
        displayThankYouData();
    }

    // Add the "Forgot Password" listener
    addForgotPasswordListener();
});
