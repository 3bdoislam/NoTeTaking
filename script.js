document.addEventListener('DOMContentLoaded', function () {
    checkAuthentication();
});

// Global variables to store username and password
let storedUsername = '';
let storedPassword = '';

function showNo() {
    document.body.innerHTML = "<div><h1>Sorry This App Is Available For Catians Only -_-</h1>" +
        "<br>" + "<img src='./pic/notAcat.webp' width='100%' height='100%'></img>" + "</div>";
}

function checkAuthentication() {
    const isLoggedIn = getCookie('isLoggedIn');

    if (isLoggedIn) {
        showNotes();
    } else {
        showWelcome();
    }
}

function showWelcome() {
    document.getElementById('welcome-container').style.display = 'block';
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('notes-container').style.display = 'none';
}

function showLogin() {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('notes-container').style.display = 'none';
    document.getElementById('welcome-container').style.display = 'none';

    // Set the input values from stored username and password
    document.getElementById('username').value = storedUsername;
    document.getElementById('password').value = storedPassword;
}

function showNotes() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('welcome-container').style.display = 'none';
    document.getElementById('notes-container').style.display = 'block';

    displayNotes();
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMeCheckbox = document.getElementById('remember-me');

    if (username === 'user' && password === 'password') {
        setCookie('isLoggedIn', 'true');
        setCookie('username', username);

        // Update stored username and password
        storedUsername = rememberMeCheckbox.checked ? username : '';
        storedPassword = rememberMeCheckbox.checked ? password : '';

        showNotes();
    } else {
        alert('Invalid credentials. Try again.');
    }
}

function logout() {
    deleteCookie('isLoggedIn');
    deleteCookie('username');
    showWelcome();
}

function addNote() {
    const noteInput = document.getElementById('note-input');
    const noteList = document.getElementById('note-list');
    const username = getCookie('username');

    if (noteInput.value.trim() !== '' && username) {
        const noteItem = document.createElement('li');
        noteItem.textContent = noteInput.value;

        // Add CRUD buttons
        const buttons = document.createElement('div');
        buttons.innerHTML = '<button onclick="editNote(this)">Edit</button> <button onclick="deleteNote(this)">Delete</button>';
        noteItem.appendChild(buttons);

        noteList.appendChild(noteItem);

        // Save note to local storage
        const userNotesKey = `notes_${username}`;
        const savedNotes = JSON.parse(localStorage.getItem(userNotesKey)) || [];
        savedNotes.push(noteInput.value);
        localStorage.setItem(userNotesKey, JSON.stringify(savedNotes));

        noteInput.value = ''; // Clear the input field
        displayNotes(); // Update the display with the new note
    }
}

function editNote(button) {
    const noteItem = button.parentNode.parentNode;
    const index = Array.from(noteItem.parentNode.children).indexOf(noteItem);
    const username = getCookie('username');
    const userNotesKey = `notes_${username}`;
    const savedNotes = JSON.parse(localStorage.getItem(userNotesKey)) || [];

    const updatedNote = prompt('Edit note:', savedNotes[index]);

    if (updatedNote !== null) {
        savedNotes[index] = updatedNote;
        localStorage.setItem(userNotesKey, JSON.stringify(savedNotes));
        displayNotes();
    }
}

function deleteNote(button) {
    const noteItem = button.parentNode.parentNode;
    const index = Array.from(noteItem.parentNode.children).indexOf(noteItem);
    const username = getCookie('username');
    const userNotesKey = `notes_${username}`;
    const savedNotes = JSON.parse(localStorage.getItem(userNotesKey)) || [];

    savedNotes.splice(index, 1);
    localStorage.setItem(userNotesKey, JSON.stringify(savedNotes));
    displayNotes();
}

function displayNotes() {
    const noteList = document.getElementById('note-list');
    const username = getCookie('username');
    const userNotesKey = `notes_${username}`;
    const savedNotes = JSON.parse(localStorage.getItem(userNotesKey)) || [];
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    noteList.innerHTML = ''; // Clear the list

    savedNotes.forEach((note, index) => {
        // Check if the note contains the search input
        if (note.toLowerCase().includes(searchInput)) {
            const noteItem = document.createElement('li');
            noteItem.textContent = note;

            // Add CRUD buttons
            const buttons = document.createElement('span');
            buttons.innerHTML = '<button onclick="editNote(this)" class="btn btn-warning" style="margin:5px;">Edit</button> <button onclick="deleteNote(this)" class="btn btn-dark">Delete</button>';
            noteItem.appendChild(buttons);

            noteList.appendChild(noteItem);
        }
    });
}

// Helper function for handling cookies
function setCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires + '; path=/';
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return '';
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
