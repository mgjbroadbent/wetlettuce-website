/*
 * images.
 */
//var exif = require('exif').ExifImage;
var image_size = require("image-size");

var svg = '';

svg += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{width}} {{height}}" preserveAspectRatio="xMidYMid meet">';
svg += '<title>{{title}}</title><style>';
svg += 'svg { background-size: 100% 100%; background-repeat: no-repeat; background-image: url({{stdres}}); } ';
//svg += '@media screen and (-webkit-min-device-pixel-ratio: 2),(min--moz-device-pixel-ratio: 2),(min-resolution: 2dppx),(min-resolution: 192dpi) { ';
//svg += 'svg { background-image: url({{highres}}); } }';
svg += '</style></svg>';

svg  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1170 617" preserveAspectRatio="xMidYMid meet">' + "\n";
svg += '<title>Lettuce Leaves on a white rectangular bowl</title>' + "\n";
svg += '<style>' + "\n";
svg += 'svg { background-size: 100% 100%; background-repeat: no-repeat; background-image: url(s/img/head_wt_1-1@1x.jpg); } @media screen and (-webkit-min-device-pixel-ratio: 2), /* Webkit-based browsers */ (min--moz-device-pixel-ratio: 2), /* Older Firefox browsers (prior to Firefox 16) */ (min-resolution: 2dppx), /* The standard way */ (min-resolution: 192dpi) /* dppx fallback */ { svg { background-image: url(s/img/head_wt_1-1@2x.jpg); } }' + "\n";
svg += '</style>' + "\n";
svg += '</svg>';

// Take the input image file, get the size of the image and calculate a list of 
// images to make it responsive.  Assume the input image is the highest resolution
// image and is 2dppx.
//
exports.svg = function(image_file, image_url, title, cb) {
    try {
        dims = image_size(image_file);
    }
    catch (e) {
        return cb(e);
    }

    var new_svg = svg.replace(/{{title}}/g, title)
                     .replace(/{{width}}/g, dims.width)
                     .replace(/{{height}}/g, dims.height)
                     .replace(/{{stdres}}/g, /*'/i/1@' +*/ image_url)
                     .replace(/{{highres}}/g, image_url);
    
    cb(null, '<object class="img-responsive" data="data:image/svg+xml;base64,' + 
             (new Buffer(new_svg).toString('base64')) + '" type="image/svg+xml">' +
             '<!--[if lte IE 8]>' +
             '<img src="'/*/i/1@'*/ + image_url + '" alt="' + title + '">' +
             '<![endif]--></object>'
    );
};

exports.fill = function(image_url, title, cb) {
/*
<span data-picture data-alt="Descriptive alt tag">
    <span data-src="images/myimage_sm.jpg"></span>
    <span data-src="images/myimage_lg.jpg" data-media="(min-width: 600px)"></span>

    <!--[if (lt IE 10) & (!IEMobile)]>
    <span data-src="images/myimage_sm.jpg"></span>
    <![endif]-->

    <!-- Fallback content for non-JS browsers. -->
    <noscript>
        <img src="images/myimage_sm.jpg" alt="Descriptive alt tag" />
    </noscript>
</span>    
*/
}
