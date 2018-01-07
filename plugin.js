/**
 * We.js user settings plugin main file
 */
module.exports = function loadPlugin(projectPath, Plugin) {
  const plugin = new Plugin(__dirname);

  plugin.setRoutes({
    'get /user-settings': {
      controller: 'user-settings',
      action: 'getCurrentUserSettings',
      responseType: 'json'
    }
  });

  /**
   * Fast loader
   * For disable auto loader and only load required features
   *
   * @param  {Object}   we   we.js app
   * @param  {Function} done callback
   */
  plugin.fastLoader = function fastLoader(we, done) {
    /**
     * user-settings controller
     *
     * @module Controller
     */
    we.controllers['user-settings'] = new we.class.Controller({
      /**
       * Get user settings action
       * Allows extension with we-plugin-user-settings:getCurrentUserSettings hook
       *
       * @param  {Object} req Express.js request
       * @param  {Object} res Express.js response
       */
      getCurrentUserSettings(req, res) {
        const we = req.we,
          config = we.config,
          data = {
            appName: config.appName,
            appLogo: config.appLogo,
            site: config.site,
            locales: config.i18n.locales,
            defaultLocale: config.i18n.defaultLocale,
            plugins: we.pluginNames
          };

        if (req.isAuthenticated()) {
          // add the authenticated user in response:
          data.authenticatedUser = req.user;
          data.authenticatedUserRoleNames = req.userRoleNames;
          // locale:
          if (
            req.user.language &&
            config.i18n.locales.indexOf(req.user.language)
          ) {
            data.activeLocale = req.user.language;
          } else {
            // authenticated user not have an locale or is invalid:
            data.activeLocale = data.defaultLocale;
          }
        } else {
          // unAuthenticated:
          data.activeLocale = data.defaultLocale;
        }

        we.hooks.trigger(
          'we-plugin-user-settings:getCurrentUserSettings',
        {
          req: req,
          res: res,
          data: data
        }, (err)=> {
          if (err) return res.serverError(err);

          res.status(200).send(data);
        });
      }
    });

    done();
  };

  return plugin;
};