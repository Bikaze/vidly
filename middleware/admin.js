function admin(req, res, next) {
    if (!req.user.isAdmin) return res.status(403).send('Acess Denied');
    next();
}

module.exports = admin;
