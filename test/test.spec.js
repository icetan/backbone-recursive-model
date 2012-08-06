var Backbone = require('backbone');
require('../index');

describe('Backbone.RecursiveModel', function () {
  var submodel1, submodel3, submodel2, model, json;

  beforeEach(function () {
    submodel1 = new Backbone.RecursiveModel({a:1});
    submodel3 = new Backbone.RecursiveModel({a:3});
    submodel2 = new Backbone.RecursiveModel({submodel3:submodel3});
    model = new Backbone.RecursiveModel({
        submodel1: submodel1
      , submodel2: submodel2
    });
    json = JSON.stringify(model);
  });

  it('considers serialized version to equal model instance.', function () {
    var model1 = new Backbone.RecursiveModel(JSON.parse(json));
    expect(model.isEqual(JSON.parse(json))).toBe(true);
    expect(model.isEqual(model1)).toBe(true);
  });

  it('considers models deserialized from same JSON but different class to NOT be equal.', function () {
    var model1 = new Backbone.Model(JSON.parse(json));
    expect(model.isEqual(model1)).toBe(false);
  });

  it('should serialize/dezerialize with same JSON result.', function () {
    model.set(JSON.parse(json));
    expect(JSON.stringify(model)).toBe(json);
  });

  it('should not create new sub models instances.', function () {
    model.set(JSON.parse(json));
    expect(model.get('submodel1').get('a')).toBe(1);
    expect(model.get('submodel2').get('submodel3').get('a')).toBe(3);
    expect(model.get('submodel2').get('submodel3') instanceof Backbone.RecursiveModel).toBe(true);
    expect(model.get('submodel2').get('submodel3')).toBe(submodel3);
  });

  it('should keep change bindings for sub models.', function () {
    var changed = false;
    submodel2.on('change:a', function () { changed = true; });
    model.set(JSON.parse(json));
    expect(changed).toBe(false);
    model.get('submodel2').set('a', 5);
    expect(changed).toBe(true);
  });

  it('should not trigger unnecessary change events for deep sub models.', function () {
    var changed = false
      , data = JSON.parse(json);
    model.on('change', function () { changed = true; });

    data.submodel2.submodel3.a = 8;
    model.set(data);
    expect(changed).toBe(false);

    submodel3.set('a', 10);
    model.set('submodel2', submodel2.attributes);
    expect(changed).toBe(false);
  });
});
