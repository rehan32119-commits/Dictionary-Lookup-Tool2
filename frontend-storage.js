(function (root, factory) {
    const api = factory();

    if (typeof module === "object" && module.exports) {
        module.exports = api;
    }

    root.PageVaultStorage = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
    function load(key, fallback) {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) return fallback;

            const parsed = JSON.parse(stored);
            return Array.isArray(fallback) ? (Array.isArray(parsed) ? parsed : fallback) : parsed;
        } catch (error) {
            console.warn(`Could not read ${key} from local storage.`, error);
            return fallback;
        }
    }

    function save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`Could not save ${key} to local storage.`, error);
            return false;
        }
    }

    return { load, save };
});
