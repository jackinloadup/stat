<?php

/**
 * Preprocessor for theme('stat_ui_editor').
 */
function template_preprocess_stat_ui_editor(&$vars) {
  drupal_add_css(drupal_get_path('module', 'stat_ui') . '/stat_ui.css');
  drupal_add_js(drupal_get_path('module', 'stat_ui') . '/stat_ui.js');
  drupal_add_js(drupal_get_path('module', 'stat_ui') . '/jquery.pageEditor.js');

  $vars['stats'] = $vars['form']['stats'];
  unset($vars['form']['contexts']);

  $vars['buttons'] = $vars['form']['buttons'];
  unset($vars['form']['buttons']);
}

/**
 * Preprocessor for theme('stat_ui_plugins').
 */
function template_preprocess_stat_ui_plugins(&$vars) {
  drupal_add_css(drupal_get_path("module", "stat_ui") ."/stat_ui.css");
  drupal_add_js(drupal_get_path("module", "stat_ui") ."/stat_ui.js");
  drupal_add_js(drupal_get_path('module', 'stat_ui') . '/jquery.pageEditor.js');

  // Provide title & desc.
  $vars['title'] = check_plain($vars['form']['#title']);
  $vars['description'] = check_plain($vars['form']['#description']);

  // Build list of plugins.
  $plugins = array();
  $vars['plugins'] = array();
  foreach (element_children($vars['form']['plugins']) as $plugin) {
    $link = array(
      'title' => $vars['form']['plugins'][$plugin]['#plugin']->title . "<span class='remove'>". t('Remove') ."</span>",
      'href' => $_GET['q'],
      'html' => TRUE,
      'fragment' => "stat-plugin-form-{$plugin}",
    );
    $class = $vars['form']['plugins'][$plugin]['#stat_enabled'] ? "stat-plugin-{$plugin}" : "stat-plugin-{$plugin} disabled";
    $vars['plugins'][$class] = $link;
  }
}

/**
 * Preprocessor for theme('stat_ui_form').
 */
function template_preprocess_stat_ui_form(&$vars) {
  drupal_add_css(drupal_get_path("module", "stat_ui") ."/stat_ui.css");
  drupal_add_js(drupal_get_path("module", "stat_ui") ."/stat_ui.js");
  drupal_add_js(drupal_get_path('module', 'stat_ui') . '/jquery.pageEditor.js');
  $vars['buttons'] = $vars['form']['buttons'];
  unset($vars['form']['buttons']);
}

/**
 * Generates the main stat_ui admin page with a tiered context listing.
 */
function theme_stat_ui_admin($form) {
  drupal_add_css(drupal_get_path("module", "stat_ui") ."/stat_ui.css");

  // Iterate once to group by tag.
  $by_tag = array();
  foreach ($form['#stats'] as $stat) {
    if (!empty($stat->tag)) {
      $by_tag[$stat->tag][$stat->name] = $stat;
    }
    else {
      $by_tag[''][$stat->name] = $stat;
    }
  }

  // Generate listing of existing contexts
  ksort($by_tag);
  $rows = array();
  foreach ($by_tag as $tag => $stats) {
    if (!empty($tag)) {
      $rows[] = array(array('data' => check_plain($tag), 'colspan' => 3, 'class' => 'tag'));
    }
    ksort($stats);
    foreach ($stats as $stat) {
      $row = array('data' => array());

      // Context info
      $storage = t('Default');
      if ($stat->export_type & EXPORT_IN_DATABASE) {
        $storage = $stat->export_type & EXPORT_IN_CODE ? t('Overridden') : t('Normal');
      }
      $data = "<strong>{$stat->name}</strong> <em class='storage'>({$storage})</em>";
      $data .= !empty($stat->description) ? '<div class="description">'. filter_xss_admin($stat->description) .'</div>' : '';
      $row['data'][] = array('data' => $data, 'colspan' => 2, 'class' => 'context-name');

      // Context actions
      $links = array(
        'edit'    => l(t('Edit'), "admin/build/context/list/{$stat->name}"),
        'delete'  => l(t('Delete'), "admin/build/context/list/{$stat->name}/delete"),
        'revert'  => l(t('Revert'), "admin/build/context/list/{$stat->name}/revert"),
        'export'  => l(t('Export'), "admin/build/context/list/{$stat->name}/export"),
        'clone'   => l(t('Clone'), "admin/build/context/list/{$stat->name}/clone"),
        'disable' => l(t('Disable'), "admin/build/context/list/{$stat->name}/disable"),
        'enable'  => l(t('Enable'), "admin/build/context/list/{$stat->name}/enable"),
      );
      foreach (array_keys($links) as $key) {
        if (!stat_ui_task_access($stat, $key)) {
          unset($links[$key]);
        }
      }
      $row['data'][] = array('data' => implode(' | ', $links), 'class' => 'stat-links');
      $row['class'] = empty($stat->disabled) ? 'enabled' : 'disabled';
      $rows[] = $row;
    }
  }
  $rows[] = array(
    drupal_render($form['tag']),
    drupal_render($form['name']),
    drupal_render($form['submit']),
  );
  $output = theme('table', array(t('stat'), '', t('Operations')), $rows, array('class' => 'stat-admin'));
  $output .= drupal_render($form);
  return $output;
}
