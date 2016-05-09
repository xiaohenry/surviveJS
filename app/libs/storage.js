// Wrapper for saving data in localStorage
// export an object with get & set method
export default {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch(e) {
            return null;
        }
    },
    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }
};
