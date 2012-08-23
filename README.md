[![build status](https://secure.travis-ci.org/icetan/backbone-recursive-model.png)](http://travis-ci.org/icetan/backbone-recursive-model)
# Backbone Recursive Model

## Is this for me?

If you need to nestle Backbone models in each other and keep instance
references and event bindings after .save(), then this is the
ticket.

## Node.js

    $ npm install backbone backbone-recursive-model

Backbone is not set as a dependency in the package.json but is required to be
installed to use the RecursiveModel class. The reason for this is because you
need to share the same instance of Backbone.

```javascript
require('backbone-recursive-model');
var Backbone = require('backbone');

var MyModel = Backbone.RecursiveModel.extend({});
```

Or

```javascript
var RecursiveModel = require('backbone-recursive-model');

var MyModel = RecursiveModel.extend({});
```

## Browser

Just include the ```index.js``` file in a script tag together with Backbone and
your ready to go.
