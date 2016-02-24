<?php

if(!defined('RESPONSIVE_WYSIWYG_IMAGES_DIR')) define('RESPONSIVE_WYSIWYG_IMAGES_DIR', rtrim(basename(dirname(__FILE__))));

HtmlEditorConfig::get('cms')->enablePlugins(array('responsive_wysiwyg_images' => sprintf('../../../%s/javascript/editor_plugin.js', RESPONSIVE_WYSIWYG_IMAGES_DIR)));

ShortcodeParser::get('default')->register('responsiveimage', array('ResponisveWYSIWYGImages', 'shortcode_handler'));