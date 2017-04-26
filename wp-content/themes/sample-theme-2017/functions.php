<?php

add_action( 'wp_enqueue_scripts', 'twentyseventeen_parent_theme_enqueue_styles' );

function twentyseventeen_parent_theme_enqueue_styles() {
    wp_enqueue_style( 'twentyseventeen-style', get_template_directory_uri() . '/style.css' );
    wp_enqueue_style( 'sample-theme-style',
        get_stylesheet_directory_uri() . '/style.css',
        array( 'twentyseventeen-style' )
    );
}

function hashedCssUrl( $key ) {
  static $map = null;
  if ( null === $map ) {
    $map = json_decode( file_get_contents( __DIR__ . '/assets/scss/dist/manifest.json' ) );
  }
  if ( !isset( $map->$key ) ) {
    throw new Exception( 'Invalid key: ' . $key );
  }
  return get_theme_file_uri('/assets/scss/dist/' . $map->$key);
}

function hashedJsUrl( $key ) {
  static $map = null;
  if ( null === $map ) {
    $map = json_decode( file_get_contents( __DIR__ . '/assets/js/dist/manifest.json' ) );
  }
  if ( !isset( $map->$key ) ) {
    throw new Exception( 'Invalid key: ' . $key );
  }
  return get_theme_file_uri('/assets/js/dist/' . $map->$key);
}


function sampleTheme_scripts() {
// Theme stylesheet.
  wp_enqueue_style( 'sampleTheme-style', hashedCssUrl( 'style.css' ), array(), null );
  // SD JS Bundles
  wp_enqueue_script( 'sd-common', hashedJsUrl( 'common.js' ), array(), null, true );
}
add_action( 'wp_enqueue_scripts', 'sampleTheme_scripts' );
