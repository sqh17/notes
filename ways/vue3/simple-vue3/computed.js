import {effect} from './effect.js';

export const computed = getter => {
  let _value = effect(getter, {
    scheduler: () => {
      _dirty = true;
    }
  });

  let _dirty = true;
  let cache;
  class ComputedRefImpl {
    get value() {
      if (_dirty) {
        _dirty = false;
        cache = _value();
      }
      return cache;
    }
  }
  return new ComputedRefImpl();
};
