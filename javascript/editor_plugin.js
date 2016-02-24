(function() {
	var each = tinymce.each;

	tinymce.create('tinymce.plugins.responsive_wysiwyg_images', {
		getInfo : function() {
			return {
				longname : 'Responsive WYSIWYG Images for SilverStripe',
				author : 'Shea Dawson',
				authorurl : 'http://www.livesource.co.nz/',
				infourl : 'http://www.livesource.co.nz/',
				version : "1.0"
			};
		},

		init : function(ed, url) {
			ed.onSaveContent.add(function(ed, o) {
				var content = jQuery(o.content);
				content.find('img[data-responsiveset]').each(function() {

					var el = jQuery(this);
					var shortCode = '[responsiveimage'
						+ ' responsiveset="' + el.data('responsiveset') + '"'
						+ ' id="' + el.data('id') + '"'
						+ ' class="' + el.attr('class') + '"'
						+ ']' + el.attr('src')
						+ '[/responsiveimage]';
					el.replaceWith(shortCode);
				});
				o.content = jQuery('<div />').append(content).html(); // Little hack to get outerHTML string
			});

			var shortTagRegex = /(.?)\[responsiveimage(.*?)\](.+?)\[\/\s*responsiveimage\s*\](.?)/gi;
			ed.onBeforeSetContent.add(function(ed, o) {
				var matches = null, content = o.content;
				var prefix, suffix, attributes, attributeString, url;
				var attrs, attr;
				var imgEl;
				// Match various parts of the embed tag
				while((matches = shortTagRegex.exec(content))) {
					prefix = matches[1];
					suffix = matches[4];
					if(prefix === '[' && suffix === ']') {
						continue;
					}
					attributes = {};
					// Remove quotation marks and trim.
					attributeString = matches[2].replace(/['"]/g, '').replace(/(^\s+|\s+$)/g, '');

					// Extract the attributes and values into a key-value array (or key-key if no value is set)
					attrs = attributeString.split(/\s+/);
					for(attribute in attrs) {
						attr = attrs[attribute].split('=');
						if(attr.length == 1) {
							attributes[attr[0]] = attr[0];
						} else {
							attributes[attr[0]] = attr[1];
						}
					}

					// Build HTML element from shortcode attributes.
					attributes.cssclass = attributes['class'];
					url = matches[3];
					imgEl = jQuery('<img/>').attr({
						'src': url,
						'data-responsiveset': attributes['responsiveset'],
						'data-id': attributes['id'],
						'class': attributes['cssclass']
					}).addClass('responsiveimage');

					jQuery.each(attributes, function (key, value) {
						imgEl.attr('data-' + key, value);
					});

					content = content.replace(matches[0], prefix + (jQuery('<div/>').append(imgEl).html()) + suffix);
				}
				o.content = content;
			});
		}
	});

	// Adds the plugin class to the list of available TinyMCE plugins
	tinymce.PluginManager.add("responsive_wysiwyg_images", tinymce.plugins.responsive_wysiwyg_images);
})();