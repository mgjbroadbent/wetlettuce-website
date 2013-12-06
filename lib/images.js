/*
 * images.
 */
var exif = require('exif').ExifImage;

var svg;

svg += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{width}} {{height}}" preserveAspectRatio="xMidYMid meet">';
svg += '<title>{{title}}</title><style>';
svg += 'svg { background-size: 100% 100%; background-repeat: no-repeat; background-image: url({{stdres}}); } ';
svg += '@media screen and (-webkit-min-device-pixel-ratio: 2),(min--moz-device-pixel-ratio: 2),(min-resolution: 2dppx),(min-resolution: 192dpi) { ';
svg += 'svg { background-image: url({{highres}}); }';
svg += '}</style></svg>';

// Take the input image file, get the size of the image and calculate a list of 
// images to make it responsive.  Assume the input image is the highest resolution
// image and is 2dppx.
//
exports.svg = function(image_file, image_url, title, cb) {
    try {
        new exif({ image: image_file }, function(err, data) {
            if (err)
                return cb(err);
            
            if (!('XResolution' in data.image) ||
                !('YResolution' in data.image))
                return cb(new Error('Height or width not found in image ' + image_file));
            
            var new_svg = svg;
            new_svg.replace(/{{title}}/g, title);
            new_svg.replace(/{{width}}/g, data.image.XResolution);
            new_svg.replace(/{{height}}/g, data.image.YResolution);
            new_svg.replace(/{{stdres}}/g, '/i/1@/' + image_url);
            new_svg.replace(/{{highres}}/g, image_url);
            
            cb(null, '<object data="data:image/svg+xml,' + 
                         (new Buffer(new_svg).toString('base64')) + '" type="image/svg+xml"' +
                     '<!--[if lte IE 8]>' +
                     '<img src="/i/1@/' + image_url + '" alt="' + title + '">' +
                     '<![endif]--></object>'
              );
        });
    } catch (e) {
        cb(new Error("Failed to read image " + image_file + " : " + e));
    }
};
