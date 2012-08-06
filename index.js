!function (require) {
  var Backbone = require('backbone')
    , Model = Backbone.Model
    , _ = require('underscore')
    , COMPATIBLE_VERSION = '0.9.2';

  if (Backbone.VERSION !== COMPATIBLE_VERSION) {
    console.warn('Backbone version might be incompatible with RecursiveModel! Running ' +
                 Backbone.VERSION + ', but needs ' + COMPATIBLE_VERSION + '.');
  }

  Backbone.RecursiveModel = Model.extend({
      // Custom Underscore equality method.
      isEqual: function(b) {
        if (b instanceof Model) {
          if (this.constructor !== b.constructor) return false;
          b = b.attributes;
        }
        return _.isEqual(this.attributes, b);
      }

      // Model.prototype.set() method copied from backbone.js 0.9.2.
    , set: function(key, value, options) {
        var attrs, attr, val;

        // Handle both
        if (_.isObject(key) || key == null) {
          attrs = key;
          options = value;
        } else {
          attrs = {};
          attrs[key] = value;
        }

        // Extract attributes and options.
        options || (options = {});
        if (!attrs) return this;
        if (attrs instanceof Model) attrs = attrs.attributes;
        if (options.unset) for (attr in attrs) attrs[attr] = void 0;

        // Run validation.
        if (!this._validate(attrs, options)) return false;

        // Check for changes of `id`.
        if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

        var changes = options.changes = {};
        var now = this.attributes;
        var escaped = this._escapedAttributes;
        var prev = this._previousAttributes || {};

        // For each `set` attribute...
        for (attr in attrs) {
          val = attrs[attr];

          // If the new and current value differ, record the change.
          if (!_.isEqual(now[attr], val) || (options.unset && _.has(now, attr))) {
            delete escaped[attr];
            (options.silent ? this._silent : changes)[attr] = true;
          }

          // Update or delete the current value.
          options.unset ? delete now[attr] :
            // If existing value is a Model use set() method recursively.
            (now[attr] instanceof Model ?
             now[attr].set(val) :
             now[attr] = val);

          // If the new and previous value differ, record the change.  If not,
          // then remove changes for this attribute.
          if (!_.isEqual(prev[attr], val) || (_.has(now, attr) != _.has(prev, attr))) {
            this.changed[attr] = val;
            if (!options.silent) this._pending[attr] = true;
          } else {
            delete this.changed[attr];
            delete this._pending[attr];
          }
        }

        // Fire the `"change"` events.
        if (!options.silent) this.change(options);
        return this;
      }
  });

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Backbone.RecursiveModel;
  }
}(typeof require !== 'undefined' ? require : function (path) {
  return {
      'backbone': Backbone
    , 'underscore': _
  }[path];
});
