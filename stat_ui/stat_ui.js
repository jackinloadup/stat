// $Id: stat_ui.js,v 1.3.2.5.2.2.2.3 2010/01/08 23:54:14 yhahn Exp $

/**
 * stat plugin form.
 */
function DrupalStatPlugins(form) {
  this.form = form;

  // Sync the form selector and state field with the list of plugins currently enabled.
  this.setState = function() {
    var state = [];
    $('.stat-plugin-list > li', this.form).each(function() {
      var plugin = $(this).attr('class').split('stat-plugin-')[1].split(' ')[0];
      if ($(this).is('.disabled')) {
        $('.stat-plugin-selector select option[value='+plugin+']', this.form).show();
      }
      else {
        state.push(plugin);
        $('.stat-plugin-selector select option[value='+plugin+']', this.form).hide();
      }
    });
    // Set the hidden plugin list state.
    $('.stat-plugin-selector input.stat-plugins-state', this.form).val(state.join(','));

    // Reset the selector.
    $('.stat-plugin-selector select', this.form).val(0);
    return this;
  };

  // Add a plugin to the list.
  this.addPlugin = function(plugin) {
    $('.stat-plugin-list > li.stat-plugin-'+plugin, this.form).removeClass('disabled');
    this.showForm(plugin).setState();
    return this;
  };

  // Remove a plugin from the list.
  this.removePlugin = function(plugin) {
    $('.stat-plugin-list > li.stat-plugin-'+plugin, this.form).addClass('disabled');
    this.hideForm(plugin).setState();
    return this;
  };

  // Show a plugin form.
  this.showForm = function(plugin) {
    $('.stat-plugin-forms > .stat-plugin-form.active-form', this.form).removeClass('active-form');
    $('.stat-plugin-forms > .stat-plugin-form-'+plugin, this.form).addClass('active-form');
    $('.stat-plugin-list > li > a').removeClass('active-form');
    $('.stat-plugin-list > li.stat-plugin-'+plugin+' > a').addClass('active-form');
    return this;
  };

  // Show a plugin form.
  this.hideForm = function(plugin) {
    $('.stat-plugin-forms > .stat-plugin-form-'+plugin, this.form).removeClass('active-form');
    $('.stat-plugin-list > li.stat-plugin-'+plugin+' > a').removeClass('active-form');
    return this;
  };

  // Select handler.
  $('.stat-plugin-selector select', this.form).change(function() {
    var plugins = $(this).parents('div.stat-plugins').data('statPlugins');
    if (plugins) {
      var plugin = $(this).val();
      plugins.addPlugin(plugin);
    }
  });

  // Show form handler.
  $('.stat-plugin-list > li > a', this.form).click(function() {
    var plugins = $(this).parents('div.stat-plugins').data('statPlugins');
    if (plugins) {
      var plugin = $(this).attr('href').split('#stat-plugin-form-')[1];
      plugins.showForm(plugin);
    }
    return false;
  });

  // Remove handler.
  $('.stat-plugin-list span.remove', this.form).click(function() {
    var plugins = $(this).parents('div.stat-plugins').data('statPlugins');
    if (plugins) {
      var plugin = $(this).parent().attr('href').split('#stat-plugin-form-')[1];
      plugins.removePlugin(plugin);
    }
    return false;
  });

  // Set the plugin states.
  this.setState();
}

Drupal.behaviors.stat_ui = function(stat) {
  // Initialize stat plugin form.
  $('form div.stat-plugins:not(.stat-ui-processed)').each(function() {
    $(this).addClass('stat-ui-processed');
    $(this).data('statPlugins', new DrupalStatPlugins($(this)));
  });

  // Initialize stat editor.
  if (jQuery().pageEditor) {
    $('form.stat-editor:not(.stat-ui-processed)')
      .addClass('stat-ui-processed')
      .pageEditor()
      .each(function() {
        var editor = $(this);
        var defaultstat = $('li.stat-editable', this).attr('id').split('stat-editable-trigger-')[1];
        $(this).data('defaultstat', defaultstat);

        // Attach start/end handlers to editable stats.
        $('li.stat-editable a.edit', editor).click(function() {
          var trigger = $(this).parents('li.stat-editable').addClass('stat-editing');
          var stat = trigger.attr('id').split('stat-editable-trigger-')[1];
          editor.pageEditor('start', stat);
          return false;
        });
        $('li.stat-editable a.done', editor).click(function() {
          editor.pageEditor('end');
          return false;
        });
        $(editor).submit(function() {
          if (editor.pageEditor('isEditing')) {
            editor.pageEditor('end');
          }
        });

        // Handler for start event.
        editor.bind('start.pageEditor', function(event, stat) {
          // Fallback to first stat if param is empty.
          if (!stat) {
            stat = $(this).data('defaultstat');
            $('li#stat-editable-trigger-'+stat, this).addClass('stat-editing');
          }
          $(document.body).addClass('stat-editing');
          $('#stat-editable-'+stat, this).show();
        });

        // Handler for end event.
        editor.bind('end.pageEditor', function(event, stat) {
          $(document.body).removeClass('stat-editing');
          $('div.stats div.stat-editable', this).hide();
          $('li.stat-editable').removeClass('stat-editing');
          $('form.stat-editor').addClass('edited');
        });
      });
  }
};
