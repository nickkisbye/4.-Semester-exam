module.exports = {
    authMiddleware: (req, res, next) => {
        if(!req.session.user) return res.sendFile(`${__dirname}/views/index.html`);
        next();
    },
    redirectLoggedInUser: (req, res, next) => {
        if(req.session.user) return res.sendFile(`${__dirname}/user/settings.html`);
        next();
    },
    adminMiddleware: (req, res, next) => {
        if(!req.session.user) return res.sendFile(`${__dirname}/views/index.html`);
        if(req.session.user.role !== 'ADMIN') return res.sendFile(`${__dirname}/user/settings.html`);
        next();
    }
}