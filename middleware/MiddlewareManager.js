module.exports = {
    authMiddleware: (req, res, next) => {
        if(!req.session.user) return res.redirect('/');
        next();
    },
    redirectLoggedInUser: (req, res, next) => {
        if(req.session.user) return res.redirect('/settings');
        next();
    },
    adminMiddleware: (req, res, next) => {
        if(!req.session.user) return res.redirect('/');
        if(req.session.user.role === 'USER') return res.redirect('/settings');
        next();
    },
}