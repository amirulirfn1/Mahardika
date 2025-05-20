// Simple validation functions
const validate = {
    // Check if email is valid
    isEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Check if string is empty
    isEmpty: function(str) {
        return !str || str.trim() === '';
    },
    
    // Check if string has minimum length
    minLength: function(str, min) {
        return str.length >= min;
    },
    
    // Check if string has maximum length
    maxLength: function(str, max) {
        return str.length <= max;
    }
};

// For CommonJS environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = validate;
}
