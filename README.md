# We.js user settings plugin

We.js plugin to expose user and system settings

## URls

### Get user settings

`get /user-settings`

## Hooks

### we-plugin-user-settings:getCurrentUserSettings
Usage:
```js
we.hooks.on('we-plugin-user-settings:getCurrentUserSettings', function(ctx, done) {
  // cosnt req = data.req,
  //   res = data.res;

  // change the ctx.data value and

  done();
});
```



## Links

* We.js site: http://wejs.org

## Copyright and license

Copyright Alberto Souza <contato@albertosouza.net> and contributors , under [the MIT license](https://github.com/wejs/we-core/blob/master/LICENSE.md).

## Sponsored by

- Linky Systems: https://linkysystems.com
