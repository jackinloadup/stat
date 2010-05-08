Drupal.verticalTabs = Drupal.verticalTabs || {};

// Note the name here matches the name of the fieldset ID.
Drupal.verticalTabs.google_analytics = function() {
  if ($('#edit-stat-google-analytics-profile-id').size()) {
    if ($('#edit-stat-google-analytics-profile-id').attr('value')) {
      return Drupal.t($('#edit-stat-google-analytics-profile-id :selected').text());
    }
    else {
      return Drupal.t('Profile not set');
    }
  }
  else {
    return '';
  }
}