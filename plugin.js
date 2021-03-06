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
            hostname: config.hostname,
            queryDefaultLimit: config.queryDefaultLimit,
            queryMaxLimit: config.queryMaxLimit,
            locales: config.i18n.locales,
            defaultLocale: config.i18n.defaultLocale,
            date: config.date, // date settings like dateFormat
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

        plugin.setCurrentUserPermissions({
          req, res, data
        });

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

    plugin.setCurrentUserPermissions = function(ctx) {
      // ctx = {req: req,res: res,data: data}
      ctx.data.userPermissions = {};

      if (ctx.req.userRoleNames.indexOf('administrator') > -1) {
        // skip if user is admin:
        return;
      }

      for (let permission in plugin.we.acl.permissions) {
        if (plugin.we.acl.canStatic(permission, ctx.req.userRoleNames)) {
          ctx.data.userPermissions[permission] = true;
        }
      }
    };

    done();
  };

  return plugin;
};