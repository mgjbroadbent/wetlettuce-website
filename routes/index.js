
/*
 * index pages.
 */

var articles = require('../lib/article')
    ;

exports.index = function(req, res) {
    // Locate the lastest 5 markdown files
    articles.get_preview_list(5, function(err, articles) {
        if (err)
            console.log("Get preview list failure: " + err + " : " + err.stack);

        res.render('index', {
            title:    'Home',
            articles: articles
        });
    });
};
