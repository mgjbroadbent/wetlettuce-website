"use strict";

var md_directory = __dirname + '/../md/'

var fs         = require('fs'),
    _          = require('underscore'),
    linereader = require('line-reader'),
    async      = require('async'),
    marked     = require('marked')
    ;

var images = require('../lib/images');

var get_date_title = function(file) {
    var matches = file.match(/^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})_(.+)\.md$/);

    if (!matches || matches.length == 0)
        return null;

    return { timestamp: new Date(matches[1], matches[2], matches[3], 
                                 matches[4], matches[5]),
             title:     matches[6]
           };
}

var get_md_preview = function(file, complete_cb) {
    var preview = '';
    linereader.eachLine(file, function(ln, last, cb) {
        preview += ln + "\n";

        if (/* /^(?:[\*_\-] ?)+$/.test(ln) || */ last) {
            cb(false);
            complete_cb(null, preview);
        }
        
        cb(true);
    });
}

var make_responsive = function(tokens, complete_cb) {
    // Look for images that have the alt text starting with R: then convert it into
    // a responsive SVG
        console.log('*** ' );
    async.each(tokens, function(item, cb) {
        console.log('*** ' + JSON.stringify(item));
        
        if (item.type === 'html' && !item.pre) {
            var matches = item.text.match(/<respimg +(?:(alt)=\\\"([^\\\"]+)\\\"|(src)=\\\"([^\\\"]+)\\?\")\/?>/);
            if (matches) {
                console.log("Match! " + matches[0]);
                var dt = {
                    alt: '',
                    src: ''
                };
                
                matches.forEach(function(el, idx) {
                    if (idx === 0)
                        return;
                    if ((idx % 2) == 1)
                        dt[el] = null;
                    else
                        dt[matches[idx-1]] = el;
                });
                
                images.svg(__dirname + '../public/' + dt.src, '/s/' + dt.src, dt.alt,
                           function(err, obj) {
                    item.text.replace(matches[0], obj); // expect one lex'd line.
                    cb(null);
                });
            }
        }
        cb(null);
    }, function(err) {
        return complete_cb(err);
    });
}

var get_preview_list = function(max_articles, complete_cb) {
    if (!_.isNumber(max_articles) || max_articles <= 0)
        return cb(new Error("max_articles is invalid"));

    fs.readdir(md_directory, function(err, files) {
        if (err)
            return cb(err);

        files.sort()
        
        var ret = [];
        async.each(files.slice(0, max_articles - 1), function(file, cb) {
            get_md_preview(md_directory + '/' + file, function(err, preview) {
                if (err)
                    return cb(err);

                var item = get_date_title(file);
                if (!item)
                    return cb(new Error('Failed to parse filename: ' + file));

                try
                {
                    item.preview = marked.parser(marked.lexer(preview));
                        ret.push(item);
/*
                    make_responsive(marked.lexer(preview), function(err, tokens) {
                        if (err) {
                            console.log("Failed to create responsive image version of " + file);
                            return cb(null);
                        }

                        item.preview = marked.parser(tokens);
                        ret.push(item);
                    });*/
                }
                catch (e)
                {
                    console.log("Failed to create HTML view of:\n" + preview + "\n" + e);
                }
                
                cb(null);
            });
        }, function(err) {
            complete_cb(err, ret);
        })
    });
}

exports.get_preview_list = get_preview_list;
