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
        const data = {};

        if (req.isAuthenticated()) {
          // add the authenticated user in response:
          data.authenticatedUser = req.user;
          data.authenticatedUserRoleNames = req.userRoleNames;
        }

        req.we.hooks.trigger(
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