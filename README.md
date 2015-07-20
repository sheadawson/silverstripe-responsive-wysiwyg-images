# silverstripe-responsive-wysiwyg-images

Extends [silverstripe-responsive-images](https://github.com/sheadawson/silverstripe-responsive-wysiwyg-images) to allow responsive images in WYSIWYG editor. When the user selects an image to insert, they are given the option of responsive sizing or standard sizing. If they choose responsive, they can select a Responsive Set to use, these sets are defined in your yml configuration. If they choose standard resizing, they get the normal Width x Height fields. 

##Requirements

SilverStripe 3
[SilverStripe Responsive Images module](https://github.com/sheadawson/silverstripe-responsive-wysiwyg-images)

##Installation

```
$ composer require sheadawson/silverstripe-responsive-wysiwyg-images dev-master
```

##Usage

Define your responsive image sets in yml config as you normally would. Sets that you would like to be available in the WYSIWYG image insert form should specify an additional "wysiwyg" property and "description" property to opt-in.

Example: 

```
ResponsiveImageExtension:
  sets:
    ResponsiveSet1:
      wysiwyg: true
      description: "ResponsiveSet1, used for X and Y"
      sizes:
        - {query: "(min-width: 200px)", size: 100}
        - {query: "(min-width: 800px)", size: 400}
        - {query: "(min-width: 1200px)", size: 800}
```

##Additional Configuration

You can set the image insert form to default to "Standard" image resizing (user sets the width and height) or "Responsive". Default is "Responsive". 
```
ResponsiveImageHtmlEditorField_Toolbar:
  default_resize_method: 'Standard'
`
