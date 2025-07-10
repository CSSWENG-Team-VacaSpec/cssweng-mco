module.exports = {
    formatPhone: (phone) => {
        if (phone && phone.startsWith('0') && phone.length === 11) {
            return `+63 ${phone.substring(1, 4)} ${phone.substring(4, 7)} ${phone.substring(7)}`;
        }
        return phone;
    }
};