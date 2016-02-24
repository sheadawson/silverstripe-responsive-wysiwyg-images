<?php
/**
 * ResponsiveImageHtmlEditorField_Toolbar
 *
 * @package silverstripe-responsive-wysiwyg-image
 * @author shea@livesource.co.nz
 **/
class ResponsiveImageHtmlEditorField_Toolbar extends Extension
{

    private static $allowed_actions = array(
        'getresampledimage'
    );


    /**
     * The default option selected in the ResizeMethod dropdown
     * Can be "Responsive" or "Standard"
     *
     * @var string
     **/
    private static $default_resize_method = 'Responsive';


    /**
     * Customise Image fields, adds responsive set options
     **/
    public function updateFieldsForImage($fields, $url, $file)
    {
        $sets = Config::inst()->get('ResponsiveImageExtension', 'sets');
        if (empty($sets)) {
            return;
        }

        $options = array();
        foreach ($sets as $k => $v) {
            if (isset($v['wysiwyg']) && $v['wysiwyg']) {
                $options[$k] = isset($v['description']) ? $v['description'] : $k;
            }
        }
        if (empty($options)) {
            return;
        }

        $width = $fields->dataFieldByName('Width');

        if ($width) {
            $resize_method_options = array(
                'Responsive' => _t('ResponsiveWYSIWYGImages.RESIZEMETHOD_STANDARD', 'Responsive'),
                'Standard' => _t('ResponsiveWYSIWYGImages.RESIZEMETHOD_STANDARD', 'Standard')
            );



            $fields->insertAfter(DropdownField::create(
                'ResizeMethod',
                _t('ResponsiveWYSIWYGImages.RESIZEMETHOD', 'Resize Method'),
                $resize_method_options,
                Config::inst()->get('ResponsiveImageHtmlEditorField_Toolbar', 'default_resize_method')),
                'CSSClass'
            );
        }

        $fields->insertAfter($responsiveSetField = DropdownField::create(
            'ResponsiveSet',
            _t('ResponsiveWYSIWYGImages.IMAGEDIMENSIONS', 'Responsive Dimensions'),
            $options)->addExtraClass('last'),
            'ResizeMethod'
        );

        $fields->push(HiddenField::create('ID', null, $file->ID));
    }

    public function updatemediaform($form)
    {
        Requirements::javascript(RESPONSIVE_WYSIWYG_IMAGES_DIR . '/javascript/HtmlEditorField.js');
    }


    /**
     * Controller method, returns filename of default resampled
     * responsive image for set. This gets loaded into the editor via ajax
     * it's the image displayed in the editor
     *
     * @return string
     **/
    public function getresampledimage($request)
    {
        $imageID = $request->getVar('id');
        $setName = $request->getVar('responsiveset');

        $sets = Config::inst()->get('ResponsiveImageExtension', 'sets');
        if (isset($sets[$setName]) && $image = Image::get()->byID($imageID)) {
            $set = $sets[$setName];
            $size = $set['default_size'];
            $width = $size;
            $height = null;
            if (strpos($size, 'x') !== false) {
                $dimensions = explode("x", $size);
            } else {
                $dimensions = array($width, $height);
            }

            return $image->getFormattedImage($set['method'], $dimensions[0], $dimensions[1])->owner->Link();
        }
    }
}
