<?php

/**
 * Expose google analytics to stat as a source.
 */
class stat_google_analytics extends stat_source {

  /**
   * Allow admins to provide a section title, section subtitle and section class.
   */
  function options_form($context) {
    $options = array();
    $themes = list_themes();
    foreach($themes as $name => $theme) {
      if($theme->status == 1) $options[$name] = $name;
    }

    $form = array(
      '#tree' => TRUE,
      '#title' => t('Theme'),
      'theme' => array(
        '#title' => t('Active theme'),
        '#description' => t('Choose a theme to activate when this context is active.'),
        '#type' => 'select',
        '#options' => $options,
        '#default_value' => 0//$this->fetch_from_context($context),
      ),
    );
    return $form;

  }

  /**
   * Set 'section_title', and 'section_subtitle' if not set and merge all
   * additional classes onto the 'body_classes'.
   */
  function execute(&$vars) {
  	stat_google_analytics_start();
	  /*
    $contexts = context_active_contexts();
    $classes = array();

    foreach ($contexts as $k => $v) {
      if (!empty($v->reactions[$this->plugin]['theme'])) {
          global $custom_theme;
          $custom_theme = $v->reactions[$this->plugin]['theme'];
      }
    }
		*/
  }
}
