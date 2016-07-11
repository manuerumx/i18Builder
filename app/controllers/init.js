var initCtrl = {
    init: function(req, res){
        console.log(req.cookies);
        res.cookie('i18nBuilder', {
            id: '1234567890',
            init: true
        },{
            httpOnly: false,
            secure: false,
            signed: false,
            path: '/',
            domain: 'localhost',
            expires: new Date(Date.now() + 900000)
        });
        res.render('index', {title: 'Hello World'});
    }
};

module.exports = initCtrl;
