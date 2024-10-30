(function($, FLBuilder) {
	CustomPreset = {
		init: function()
		{
			FLBuilder.addHook( 'didSavePresetSettingsComplete', this.updateOnSavePresetSettings.bind( this ) );
			FLBuilder.addHook('aePresetSettings', this._addPresetButtonClicked.bind(this));
			CustomPreset._bindEvents();
		},

		_bindEvents: function() {
			$('body').delegate('.fl-builder-preset-settings .fl-builder-settings-save', 'click', CustomPreset._savePresetSettingsClicked);
			$('body').delegate('.fl-builder-preset-settings .fl-builder-settings-cancel', 'click', FLBuilder._cancelLayoutSettingsClicked);
		},

		_addPresetButtonClicked: function()
		{
			FLBuilderSettingsForms.render( {
				id        : 'preset',
				className : 'fl-builder-preset-settings',
				settings  : FLBuilderConfig.preset
			}, function() {
				FLBuilder._layoutSettingsInitCSS();
			} );

			FLBuilder.MainMenu.hide();
		},

		_savePresetSettingsClicked: function()
		{
			var form     = $(this).closest('.fl-builder-settings'),
				valid    = form.validate().form(),
				settings = FLBuilder._getSettings( form );

			if(valid) {

				FLBuilder.showAjaxLoader();
				FLBuilder._layoutSettingsCSSCache = null;

				FLBuilder.ajax({
					action: 'save_preset_settings',
					settings: settings
				}, CustomPreset._savePresetSettingsComplete);

				FLBuilder._lightbox.close();
			}
		},

		_savePresetSettingsComplete: function( response )
		{
			FLBuilderConfig.preset = JSON.parse( response );

			FLBuilder.triggerHook( 'didSavePresetSettingsComplete', FLBuilderConfig.preset );
			FLBuilder._updateLayout();

			location.reload(true);
		},

		updateOnSavePresetSettings: function( e, settings ) {
			this.preset = settings;
		},

		aePresetSettings: function() {
			CustomPreset._addPresetButtonClicked();
			FLBuilder.MainMenu.hide();
		}
	}

	$(function(){ 
		CustomPreset.init();
	});

})(jQuery, FLBuilder);