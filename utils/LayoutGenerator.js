const fs = require('fs');
const path = require('path');

module.exports = {
    generateLayout: (page, userSession) => {
        let header = null;
        
        if(!userSession) {
            header = fs.readFileSync(path.join(__dirname, '../views/', 'header.html'), "utf8");
        } else if(userSession.role === 'ADMIN') {
            header = fs.readFileSync(path.join(__dirname, '../views/admin', 'header.html'), "utf8");
        } else { 
            header = fs.readFileSync(path.join(__dirname, '../views/user', 'header.html'), "utf8");
        }

        let footer = fs.readFileSync(path.join(__dirname, '../views/', 'footer.html'), "utf8");
        
        return header + page + footer;
    }
}