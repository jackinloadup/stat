<?php

/**
 * Stat plugins.
 */
function _stat_stat_plugins() {
  $plugins = array();

  /**
   * Sources.
   */
  $plugins['stat_source'] = array(
    'handler' => array(
      'path' => drupal_get_path('module', 'stat') .'/plugins',
      'file' => 'stat_source.inc',
      'class' => 'stat_source',
    ),
  );

  return $plugins;
}
