(function($) {

	$.entwine('ss', function($) {

		$('.ss-htmleditorfield-file.image select#ResizeMethod').entwine({
			DimensionsField: null,
			ResponsiveSetField: null,
			onadd: function(){
				this.setResponsiveSetField($('#ResponsiveSet.field'));
				this.setDimensionsField($('.field.dimensions'));
				this.updateDimensionsFields();
				this._super();
			},
			onchange: function(){
				this.updateDimensionsFields();	
			},
			updateDimensionsFields: function(){
				var self = this;
				if(self.val() == 'Standard'){
					this.getResponsiveSetField().hide();
					this.getDimensionsField().show();
				}else{
					this.getResponsiveSetField().show();
					this.getDimensionsField().hide();
				}
			}
		});

		$('form.htmleditorfield-mediaform .ss-htmleditorfield-file.image').entwine({
			getAttributes: function() {
				var width = this.find(':input[name=Width]').val(),
					height = this.find(':input[name=Height]').val();

				var attrs = {
					'src': this.find(':input[name=URL]').val(),
					'alt': this.find(':input[name=AltText]').val(),
					'title': this.find(':input[name=Title]').val(),
					'class': this.find(':input[name=CSSClass]').val(),
				};

				if(this.find(':input[name=ResizeMethod]').val() == 'Responsive'){
					attrs['data-responsiveset'] = this.find(':input[name=ResponsiveSet]').val();
					attrs['data-id'] = this.find(':input[name=ID]').val();
				}else{
					attrs['width'] = width;
					attrs['height'] = height;
					delete attrs['data-responsiveset'];
				}

				return attrs;
			},
			getExtraData: function() {
				return {
					'CaptionText': this.find(':input[name=CaptionText]').val()
				};
			},
			getHTML: function() {
				/* NOP */
			},
			/**
			 * Logic similar to TinyMCE 'advimage' plugin, insertAndClose() method.
			 */
			insertHTML: function(ed) {
				var self = $(this);
				// Get the attributes & extra data
				var attrs = self.getAttributes();
			
				var doInsert = function(attrs, ed, self){
					var extraData = {
						// TODO this should use getExtraData(), but it breaks for some reason...
						'CaptionText': self.find(':input[name=CaptionText]').val()
					};
					var form = self.closest('form');
					var node = form.getSelection();
					var img = (node && node.is('img')) ? node : $('<img />');
					if (!ed) ed = form.getEditor();
					
					// Find the element we are replacing - either the img, it's wrapper parent, or nothing (if creating)
					var replacee = (node && node.is('img')) ? node : null;
					if (replacee && replacee.parent().is('.captionImage')) replacee = replacee.parent();

					// Find the img node - either the existing img or a new one, and update it
					img.attr(attrs);

					// Any existing figure or caption node
					var container = img.parent('.captionImage'), caption = container.find('.caption');

					// If we've got caption text, we need a wrapping div.captionImage and sibling p.caption
					if (extraData.CaptionText) {
						if (!container.length) {
							container = $('<div></div>');
						}

						container.attr('class', 'captionImage '+attrs['class']).css('width', attrs.width);

						if (!caption.length) {
							caption = $('<p class="caption"></p>').appendTo(container);
						}

						caption.attr('class', 'caption '+attrs['class']).text(extraData.CaptionText);
					}
					// Otherwise forget they exist
					else {
						container = caption = null;
					}

					// The element we are replacing the replacee with
					var replacer = container ? container : img;

					// If we're replacing something, and it's not with itself, do so
					if (replacee && replacee.not(replacer).length) {
						replacee.replaceWith(replacer);
					}

					// remove attributes
					if(typeof attrs['data-responsiveset'] === 'undefined'){
						img.removeAttr('data-responsiveset');
						img.removeAttr('data-id');
					}else{
						img.css({'width' : '', 'height' : ''});
						img.removeAttr('width');
						img.removeAttr('height');
					}

					// If we have a wrapper element, make sure the img is the first child - img might be the
					// replacee, and the wrapper the replacer, and we can't do this till after the replace has happened
					if (container) {
						container.prepend(img);
					}

					// If we don't have a replacee, then we need to insert the whole HTML
					if (!replacee) {
						// Otherwise insert the whole HTML content
						ed.repaint();
						ed.insertContent($('<div />').append(replacer).html(), {skip_undo : 1});
					}

					ed.addUndo();
					ed.repaint();
				}

				// insert responsive
				if(typeof attrs['data-responsiveset'] !== 'undefined'){
					var link = $('#cms-editor-dialogs').data('url-mediaform').replace('MediaForm/forTemplate', 'getresampledimage');
					$.get(link, {responsiveset: attrs['data-responsiveset'], id: attrs['data-id']}, function(imgsrc){
						if(imgsrc){
							attrs['src'] = imgsrc;
							attrs['data-mce-src'] = imgsrc;	
						}
						doInsert(attrs, ed, self);
					});
				// insert standard
				}else{
					doInsert(attrs, ed, self);
				}
			},
			updateFromNode: function(node) {
				this.find(':input[name=AltText]').val(node.attr('alt'));
				this.find(':input[name=Title]').val(node.attr('title'));
				this.find(':input[name=CSSClass]').val(node.attr('class'));
				this.find(':input[name=CaptionText]').val(node.siblings('.caption:first').text());
				
				if(node.data('responsiveset')){
					this.find(':input[name=ResponsiveSet]').val(node.data('responsiveset'));

					this.find(':input[name=ResizeMethod]').val('Responsive').trigger('change');	
				}else{
					this.find(':input[name=Width]').val(node.width());
					this.find(':input[name=Height]').val(node.height());
					this.find(':input[name=ResizeMethod]').val('Standard').trigger('change');	
				}
			}
		});
	});
})(jQuery);
