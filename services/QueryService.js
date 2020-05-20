module.exports = {
    getSecureParameters: () => {
        return ['id', 'username', 'email', 'first_name', 'last_name', 'age', 'phone_number', 'address_id', 'role_id'];
    },
    getSessionParameters: () => {
        return ['id', 'username', 'role_id'];
    },
    getAllParameters: () => {
        return ['id', 'username', 'email', 'first_name', 'last_name', 'age', 'phone_number', 'address_id', 'role_id', 'password'];
    }
}
