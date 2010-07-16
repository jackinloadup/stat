<div class='stat-plugins clear-block'>
  <div class='stat-plugin-forms'>
    <?php foreach (element_children($form['plugins']) as $plugin): ?>
      <div class='stat-plugin-form stat-plugin-form-<?php print $plugin ?>'>
        <?php print drupal_render($form['plugins'][$plugin]) ?>
      </div>
    <?php endforeach; ?>
  </div>

  <div class='stat-plugin-selector'>
    <div class='stat-plugin-info'>
      <h2 class='stat-plugin-title'><?php print $title ?></h2>
      <div class='description'><?php print $description ?></div>
      <?php print drupal_render($form['selector']) ?>
      <?php print drupal_render($form['state']) ?>
    </div>
    <?php print theme('links', $plugins, array('class' => 'stat-plugin-list')) ?>
  </div>

  <?php print drupal_render($form) ?>

</div>
