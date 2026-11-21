// ========================================
// PAGEVAULT - FRONTEND JAVASCRIPT
// ========================================

const sampleBooks = [
    {
        id: 1,
        title: "Operating System Concepts",
        author: "Abraham Silberschatz",
        edition: "10th Edition",
        course: "CS301",
        department: "Computer Science",
        condition: "Good",
        isbn: "9781119456339",
        owner: "You",
        status: "Available"
    },
    {
        id: 2,
        title: "Computer Networks",
        author: "Andrew S. Tanenbaum",
        edition: "5th Edition",
        course: "CS302",
        department: "Computer Science",
        condition: "Excellent",
        isbn: "9780132126953",
        owner: "Rahul",
        status: "Available"
    },
    {
        id: 3,
        title: "Database System Concepts",
        author: "Henry F. Korth",
        edition: "7th Edition",
        course: "CS303",
        department: "Computer Science",
        condition: "Good",
        isbn: "9780078022159",
        owner: "You",
        status: "Borrowed"
    },
    {
        id: 4,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        edition: "3rd Edition",
        course: "CS304",
        department: "Computer Science",
        condition: "Excellent",
        isbn: "9780262033848",
        owner: "Priya",
        status: "Available"
    },
    {
        id: 5,
        title: "Engineering Mechanics",
        author: "R. C. Hibbeler",
        edition: "14th Edition",
        course: "ME201",
        department: "Mechanical",
        condition: "Good",
        isbn: "9780133918922",
        owner: "You",
        status: "Available"
    },
    {
        id: 6,
        title: "Thermodynamics",
        author: "Yunus A. Cengel",
        edition: "9th Edition",
        course: "ME202",
        department: "Mechanical",
        condition: "Fair",
        isbn: "9781259822674",
        owner: "Arjun",
        status: "Available"
    },
    {
        id: 7,
        title: "Electrical Engineering",
        author: "B. L. Theraja",
        edition: "23rd Edition",
        course: "EE201",
        department: "Electrical",
        condition: "Good",
        isbn: "9788121924405",
        owner: "You",
        status: "Borrowed"
    },
    {
        id: 8,
        title: "Basic Electrical Engineering",
        author: "V. K. Mehta",
        edition: "Latest Edition",
        course: "EE202",
        department: "Electrical",
        condition: "Excellent",
        isbn: "9788121922860",
        owner: "Ananya",
        status: "Available"
    },
    {
        id: 9,
        title: "Surveying",
        author: "B. C. Punmia",
        edition: "17th Edition",
        course: "CE201",
        department: "Civil",
        condition: "Good",
        isbn: "9788170088530",
        owner: "You",
        status: "Available"
    },
    {
        id: 10,
        title: "Engineering Mathematics",
        author: "B. S. Grewal",
        edition: "44th Edition",
        course: "MA201",
        department: "Science",
        condition: "Excellent",
        isbn: "9788193328491",
        owner: "Kiran",
        status: "Available"
    },
    {
        id: 11,
        title: "Physics for Scientists",
        author: "Raymond A. Serway",
        edition: "10th Edition",
        course: "PH201",
        department: "Science",
        condition: "Good",
        isbn: "9781337553278",
        owner: "You",
        status: "Available"
    },
    {
        id: 12,
        title: "Data Structures",
        author: "Mark Allen Weiss",
        edition: "4th Edition",
        course: "CS305",
        department: "Computer Science",
        condition: "Good",
        isbn: "9780132847377",
        owner: "Sneha",
        status: "Available"
    }
];

let books = PageVaultStorage.load("pagevaultBooks", sampleBooks);

let requests = PageVaultStorage.load("pagevaultRequests", [
    {
        id: 1,
        bookId: 1,
        bookTitle: "Operating System Concepts",
        owner: "You",
        borrower: "Student B",
        status: "Pending",
        dueDate: null
    }
]);

// Save data in browser
function saveData() {
    const booksSaved = PageVaultStorage.save("pagevaultBooks", books);
    const requestsSaved = PageVaultStorage.save("pagevaultRequests", requests);

    if (!booksSaved || !requestsSaved) {
        showToast("Browser storage is unavailable. Changes will last only in this tab.");
    }
}

// ========================================
// DASHBOARD STATISTICS
// ========================================

function updateStats() {
    document.getElementById("totalBooks").textContent = books.length;

    document.getElementById("availableBooks").textContent =
        books.filter(book => book.status === "Available").length;

    document.getElementById("borrowedBooks").textContent =
        books.filter(book => book.status === "Borrowed").length;

    document.getElementById("totalRequests").textContent =
        requests.filter(request => request.status === "Pending").length;
}

// ========================================
// DISPLAY BOOKS
// ========================================

function displayBooks() {

    const grid = document.getElementById("bookGrid");

    const search = document.getElementById("searchInput")
        .value.toLowerCase();

    const department = document.getElementById("departmentFilter").value;

    const status = document.getElementById("statusFilter").value;

    const filteredBooks = PageVaultUtils.filterBooks(
        books,
        search,
        department,
        status
    );

    const clearFilters = document.getElementById("clearFilters");
    if (clearFilters) {
        clearFilters.hidden =
            !search && !department && !status;
    }

    grid.innerHTML = "";

    document.getElementById("emptyMessage").hidden =
        filteredBooks.length !== 0;

    const resultCount = document.getElementById("resultCount");
    if (resultCount) {
        resultCount.textContent =
            `${filteredBooks.length} ${filteredBooks.length === 1 ? "book" : "books"}`;
    }

    filteredBooks.forEach(book => {

        const card = document.createElement("div");
        card.className = "book-card";

        const buttonText =
            book.status === "Available" ? "Request Borrow" :
            book.status === "Reserved" ? "Request Pending" :
            "Currently Borrowed";

        card.innerHTML = `
            <div class="book-cover">📚</div>

            <h3>${escapeHTML(book.title)}</h3>

            <p><strong>Author:</strong> ${escapeHTML(book.author)}</p>

            <p><strong>Course:</strong> ${escapeHTML(book.course)}</p>

            <p><strong>Department:</strong> ${escapeHTML(book.department)}</p>

            <p><strong>Edition:</strong> ${escapeHTML(book.edition || "Not specified")}</p>

            <p><strong>Condition:</strong> ${escapeHTML(book.condition)}</p>

            <span class="status ${book.status}">
                ${book.status}
            </span>

            <p><strong>Owner:</strong> ${escapeHTML(book.owner)}</p>

            <button class="card-btn"
                onclick="requestBook(${book.id})"
                ${book.status !== "Available" ? "disabled" : ""}>
                ${buttonText}
            </button>
        `;

        grid.appendChild(card);
    });
}

// Escape user-provided text before displaying it
function escapeHTML(value) {
    return PageVaultUtils.escapeHTML(value);
}

let toastTimer;

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

// ========================================
// SEARCH AND FILTER
// ========================================

document.getElementById("searchInput")
    .addEventListener("input", displayBooks);

document.getElementById("departmentFilter")
    .addEventListener("change", displayBooks);

document.getElementById("statusFilter")
    .addEventListener("change", displayBooks);

document.getElementById("clearFilters")
    .addEventListener("click", () => {
        document.getElementById("searchInput").value = "";
        document.getElementById("departmentFilter").value = "";
        document.getElementById("statusFilter").value = "";
        displayBooks();
    });

document.getElementById("lookupISBN")
    .addEventListener("click", lookupISBN);

async function lookupISBN() {
    const isbnInput = document.getElementById("bookISBN");
    const status = document.getElementById("isbnStatus");

    if (!isbnInput) return;

    const isbn = PageVaultUtils.normalizeISBN(isbnInput.value);

    if (!PageVaultUtils.isValidISBN(isbn)) {
        status.textContent = "Enter a valid 10 or 13 digit ISBN.";
        status.className = "form-status error";
        isbnInput.focus();
        return;
    }

    status.textContent = "Looking up book details...";
    status.className = "form-status";
    document.getElementById("lookupISBN").disabled = true;

    try {
        const response = await fetch(
            `https://openlibrary.org/api/books?bibkeys=ISBN:${encodeURIComponent(isbn)}&jscmd=data&format=json`
        );

        if (!response.ok) throw new Error(`Lookup failed (${response.status})`);

        const data = await response.json();
        const book = data[`ISBN:${isbn}`];

        if (!book) {
            status.textContent = "No matching book was found.";
            status.className = "form-status error";
            return;
        }

        document.getElementById("bookTitle").value =
            book.title || document.getElementById("bookTitle").value;
        document.getElementById("bookAuthor").value =
            (book.authors || []).map(author => author.name).join(", ");
        document.getElementById("bookEdition").value =
            book.edition_name || "";

        status.textContent = "Book details found and filled.";
        status.className = "form-status success";
    } catch (error) {
        console.warn("Open Library lookup failed.", error);
        status.textContent = "Lookup unavailable. You can enter the details manually.";
        status.className = "form-status error";
    } finally {
        document.getElementById("lookupISBN").disabled = false;
    }
}

// ========================================
// ADD NEW BOOK
// ========================================

function showForm() {
    const modal = document.getElementById("bookModal");
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("bookTitle").focus();
}

function closeForm() {
    const modal = document.getElementById("bookModal");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.getElementById("isbnStatus").textContent = "";
    document.getElementById("isbnStatus").className = "form-status";
}

document.getElementById("bookForm").addEventListener("submit", function(e) {

    e.preventDefault();

    const isbn = document.getElementById("bookISBN").value.trim();
    if (isbn && !PageVaultUtils.isValidISBN(isbn)) {
        const status = document.getElementById("isbnStatus");
        status.textContent = "Enter a valid 10 or 13 digit ISBN.";
        status.className = "form-status error";
        document.getElementById("bookISBN").focus();
        return;
    }

    const newBook = {
        id: Date.now(),
        title: document.getElementById("bookTitle").value.trim(),
        author: document.getElementById("bookAuthor").value.trim(),
        edition: document.getElementById("bookEdition").value.trim(),
        course: document.getElementById("bookCourse").value.trim().toUpperCase(),
        department: document.getElementById("bookDepartment").value,
        condition: document.getElementById("bookCondition").value,
        isbn: document.getElementById("bookISBN").value.trim(),
        owner: "You",
        status: "Available"
    };

    books.unshift(newBook);

    saveData();
    updateStats();
    displayBooks();
    renderDashboard("listed");

    this.reset();
    closeForm();

    showToast("Your book has been successfully listed.");
});

// ========================================
// BORROW BOOK REQUEST
// ========================================

function requestBook(bookId) {

    const book = books.find(b => b.id === bookId);

    if (!book || book.status !== "Available") {
        showToast("This book is not available.");
        return;
    }

    openConfirm(
        "Request this book?",
        `Send a borrow request for "${book.title}"?`,
        () => {
            const newRequest = {
                id: Date.now(),
                bookId: book.id,
                bookTitle: book.title,
                owner: book.owner,
                borrower: "Student B",
                status: "Pending",
                dueDate: null
            };

            book.status = "Reserved";
            requests.unshift(newRequest);

            saveData();
            updateStats();
            displayBooks();
            renderDashboard("requests");
            showToast("Borrow request submitted successfully.");
        }
    );
}

// ========================================
// DASHBOARD TABS
// ========================================

let currentTab = "listed";

function switchTab(tab) {

    currentTab = tab;

    document.querySelectorAll(".tab-btn").forEach(button => {
        button.classList.remove("active");
    });

    const selectedTab = document.querySelector(
        `.tab-btn[onclick="switchTab('${tab}')"]`
    );
    if (selectedTab) selectedTab.classList.add("active");

    renderDashboard(tab);
}

// ========================================
// DASHBOARD CONTENT
// ========================================

function renderDashboard(tab = currentTab) {

    currentTab = tab;

    const container = document.getElementById("dashboardContent");

    let content = "";

    if (tab === "listed") {

        const myBooks = books.filter(book => book.owner === "You");

        content = `
            <div class="table-wrap">
            <table>
                <tr>
                    <th>Book Name</th>
                    <th>Course</th>
                    <th>Availability</th>
                </tr>

                ${myBooks.map(book => `
                    <tr>
                        <td>${escapeHTML(book.title)}</td>
                        <td>${escapeHTML(book.course)}</td>
                        <td>
                            <span class="status ${book.status}">
                                ${book.status}
                            </span>
                        </td>
                    </tr>
                `).join("")}
            </table>
            </div>
        `;
    }

    else if (tab === "borrowed") {

        const myBorrowed = requests.filter(request =>
            request.borrower === "Student B" &&
            request.status === "Approved"
        );

        content = `
            <div class="table-wrap">
            <table>
                <tr>
                    <th>Book Name</th>
                    <th>Return Date</th>
                    <th>Countdown</th>
                    <th>Action</th>
                </tr>

                ${myBorrowed.map(request => `
                    <tr>
                        <td>${escapeHTML(request.bookTitle)}</td>
                        <td>${formatDate(request.dueDate)}</td>
                        <td>${getCountdown(request.dueDate)}</td>
                        <td>
                            <button class="action-btn"
                                onclick="returnBook(${request.id})">
                                Return Book
                            </button>
                        </td>
                    </tr>
                `).join("")}
            </table>
            </div>
        `;
    }

    else if (tab === "requests") {

        content = `
            <div class="table-wrap">
            <table>
                <tr>
                    <th>Book</th>
                    <th>Borrower</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>

                ${requests.map(request => `
                    <tr>
                        <td>${escapeHTML(request.bookTitle)}</td>
                        <td>${escapeHTML(request.borrower)}</td>
                        <td>
                            <span class="status ${request.status}">
                                ${request.status}
                            </span>
                        </td>
                        <td>
                            ${request.owner === "You" &&
                            request.status === "Pending" ? `
                                <button class="action-btn"
                                    onclick="approveRequest(${request.id})">
                                    Approve
                                </button>

                                <button class="action-btn reject-btn"
                                    onclick="rejectRequest(${request.id})">
                                    Reject
                                </button>
                            ` : "-"}
                        </td>
                    </tr>
                `).join("")}
            </table>
            </div>
        `;
    }

    container.innerHTML = content;
}

// ========================================
// APPROVE BORROW REQUEST
// ========================================

function approveRequest(requestId) {

    const request = requests.find(r => r.id === requestId);

    if (!request || request.status !== "Pending") return;

    const book = books.find(b => b.id === request.bookId);

    if (!book || book.status !== "Reserved") return;

    request.status = "Approved";

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    request.dueDate = dueDate.toISOString();

    book.status = "Borrowed";

    saveData();
    updateStats();
    displayBooks();
    renderDashboard("requests");
    showReminders();

    showToast("Request approved. The return deadline is 7 days.");
}

// ========================================
// REJECT BORROW REQUEST
// ========================================

function rejectRequest(requestId) {

    const request = requests.find(r => r.id === requestId);

    if (!request || request.status !== "Pending") return;

    const book = books.find(b => b.id === request.bookId);

    request.status = "Rejected";

    if (book && book.status === "Reserved") {
        book.status = "Available";
    }

    saveData();
    updateStats();
    displayBooks();
    renderDashboard("requests");

    showToast("Borrow request rejected.");
}

// ========================================
// RETURN BOOK
// ========================================

function returnBook(requestId) {

    const request = requests.find(r => r.id === requestId);

    if (!request || request.status !== "Approved") return;

    const book = books.find(b => b.id === request.bookId);

    request.status = "Returned";

    if (book) {
        book.status = "Available";
    }

    saveData();
    updateStats();
    displayBooks();
    renderDashboard("borrowed");

    showToast("Book returned successfully.");
}

// ========================================
// DUE DATE COUNTDOWN
// ========================================

function getCountdown(dueDate) {
    return PageVaultUtils.getCountdown(dueDate);
}

function formatDate(date) {
    return PageVaultUtils.formatDate(date);
}

// ========================================
// AUTOMATED DUE DATE REMINDERS
// ========================================

function showReminders() {

    const reminderBox = document.getElementById("reminders");

    const activeBorrowings = requests.filter(request =>
        request.status === "Approved"
    );

    const warnings = activeBorrowings.filter(request => {
        return new Date(request.dueDate) -
            new Date() <= 2 * 24 * 60 * 60 * 1000;
    });

    if (warnings.length > 0) {

        reminderBox.innerHTML = `
            <div class="reminder">
                ⚠️ <strong>Return Reminder!</strong>
                You have ${warnings.length} book(s)
                due within 2 days or overdue.
                Please return them on time.
            </div>
        `;

    } else {

        reminderBox.innerHTML = "";
    }
}

// Browser notification simulation
function enableNotifications() {

    if (!("Notification" in window)) {
        alert("Browser notifications are not supported.");
        return;
    }

    Notification.requestPermission().then(permission => {

        if (permission === "granted") {

            new Notification("PageVault Notifications", {
                body: "Return your borrowed books on time!"
            });

        }
    });
}

// ========================================
// INITIALIZE WEBSITE
// ========================================

function initializeApp() {

    updateStats();
    displayBooks();
    renderDashboard("listed");
    showReminders();

    // Refresh countdown and reminder information
    setInterval(() => {
        showReminders();

        if (currentTab === "borrowed") {
            renderDashboard("borrowed");
        }
    }, 60000);
}

initializeApp();

const bookModal = document.getElementById("bookModal");
const confirmModal = document.getElementById("confirmModal");
let confirmAction = null;

function openConfirm(title, message, action) {
    confirmAction = action;
    document.getElementById("confirmTitle").textContent = title;
    document.getElementById("confirmMessage").textContent = message;
    confirmModal.style.display = "flex";
    confirmModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeConfirm() {
    confirmAction = null;
    confirmModal.style.display = "none";
    confirmModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

document.getElementById("confirmCancel")
    .addEventListener("click", closeConfirm);

document.getElementById("confirmAccept")
    .addEventListener("click", () => {
        const action = confirmAction;
        closeConfirm();
        if (typeof action === "function") action();
    });

confirmModal.addEventListener("click", event => {
    if (event.target === confirmModal) closeConfirm();
});

bookModal.addEventListener("click", event => {
    if (event.target === bookModal) closeForm();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && confirmModal.style.display === "flex") {
        closeConfirm();
        return;
    }

    if (event.key === "Escape" && bookModal.style.display === "flex") {
        closeForm();
    }
});