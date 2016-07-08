var initCtrl = {
    init: function(req, res){
        res.render('index', {title: 'Hello World'});
    }
};

module.exports = initCtrl;
