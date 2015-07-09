<?php

class ResponsiveImageHTMLEditorField_Toolbar extends Extension{

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
}