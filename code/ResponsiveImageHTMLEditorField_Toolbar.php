<?php

class ResponsiveImageHTMLEditorField_Toolbar extends Extension{

	private static $allowed_actions = array(
		'getresampledimage'
	);

	public function updateFieldsForImage($fields, $url, $file){
		$sets = Config::inst()->get('ResponsiveImageExtension', 'sets');
		if(!empty($sets)){
			$fields->removeByName('Dimensions');	

			$options = array();
			foreach ($sets as $k => $v) {
				$options[$k] = isset($sets[$k]['description']) ? $sets[$k]['description'] : $k;
			}
			
			$fields->push(DropdownField::create('ResponsiveSet', _t('ResponsiveWYSIWYGImages.IMAGEDIMENSIONS', 'Responsive Dimensions'), $options));
			$fields->push(HiddenField::create('ID', null, $file->ID ));
		}
	}

	public function updatemediaform($form){
		Requirements::javascript(RESPONSIVE_WYSIWYG_IMAGES_DIR . '/javascript/HTMLEditorField.js');
	}

	public function getresampledimage($request){
		$imageID = $request->getVar('id');
		$setName = $request->getVar('responsiveset');
		
		$sets = Config::inst()->get('ResponsiveImageExtension', 'sets');
		if(isset($sets[$setName]) && $image = Image::get()->byID($imageID)){
			$set = $sets[$setName];
			$size = $set['default_size'];
			$width = $size;
			$height = null;
			if(strpos($size, 'x') !== false) {
				$dimensions = explode("x", $size);
			}else{
				$dimensions = array($width, $height);
			}
	
			return $image->getFormattedImage($set['method'], $dimensions[0], $dimensions[1])->owner->Link();	
		}

		
	}
}