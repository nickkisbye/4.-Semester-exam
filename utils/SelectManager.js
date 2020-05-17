class SelectManager {
    constructor() {
        this.secureParameters = ['id', 'username', 'email', 'first_name', 'last_name', 'age', 'phone_number', 'address_id', 'role_id'];
        this.sessionParameters = ['id', 'username', 'role_id'];
        this.allParameters = this.secureParameters.push('password');
    }

    getSecureParameters = () => {
        return this.secureParameters;
    }

    getSessionParameters = () => {
        return this.sessionParameters;
    }

    getAllParameters = () => {
        return this.allParameters;
    }
}

module.exports = SelectManager;