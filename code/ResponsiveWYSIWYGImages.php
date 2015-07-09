<?php

class ResponisveWYSIWYGImages extends Object{

	/**
	 * Replace "[responsiveimage]" shortcode with responsive image markup
	 * @param $arguments array Arguments to the shortcode
	 * @param $content string Content of the returned link (optional)
	 * @param $parser object Specify a parser to parse the content (see {@link ShortCodeParser})
	 * @return string rendered HTML template
	 */
	public static function shortcode_handler($arguments, $content = null, $parser = null) {
		$setName = isset($arguments['responsiveset']) ? $arguments['responsiveset'] : null;
		$id = isset($arguments['id']) ? $arguments['id'] : null;

		if(!$setName || !$id){
			return;
		}

		$image = Image::get()->byID($id);
		$sets = Config::inst()->get('ResponsiveImageExtension', 'sets');

		if(!$image || !isset($sets[$setName])){
			return;
		}

		$set = $sets[$setName];

		return $image->$setName()->forTemplate();
	}
}