(function (root, factory) {
    const api = factory();

    if (typeof module === "object" && module.exports) {
        module.exports = api;
    }

    root.PageVaultUtils = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    function normalizeISBN(value) {
        return String(value ?? "").replace(/[^0-9Xx]/g, "").toUpperCase();
    }

    function isValidISBN(value) {
        const isbn = normalizeISBN(value);
        return isbn.length === 10 || isbn.length === 13;
    }

    function filterBooks(books, search, department, status) {
        const query = String(search ?? "").trim().toLowerCase();

        return (books || []).filter(book => {
            const matchesSearch = !query || [
                book.title,
                book.author,
                book.course,
                book.department,
                book.isbn
            ].some(value => String(value ?? "").toLowerCase().includes(query));

            const matchesDepartment =
                !department || book.department === department;
            const matchesStatus =
                !status || book.status === status;

            return matchesSearch && matchesDepartment && matchesStatus;
        });
    }

    function getCountdown(dueDate, now = new Date()) {
        if (!dueDate) return "-";

        const remaining = new Date(dueDate) - now;
        if (remaining <= 0) return '<span style="color:red">Overdue</span>';

        const days = Math.ceil(remaining / (1000 * 60 * 60 * 24));
        return `${days} day(s) remaining`;
    }

    function formatDate(date) {
        if (!date) return "-";
        const parsed = new Date(date);
        return Number.isNaN(parsed.getTime())
            ? "-"
            : parsed.toLocaleDateString("en-IN");
    }

    return {
        escapeHTML,
        normalizeISBN,
        isValidISBN,
        filterBooks,
        getCountdown,
        formatDate
    };
});
