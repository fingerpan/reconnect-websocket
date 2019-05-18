

import {
  findIndex,
  merge,
  get,
  getType,


} from '../src/util'

describe('util normal', function() {
  it('once function can work', function() {
      let testArray = [1, 2, 3, 4, 5]
      expect(findIndex(testArray, i => i === 5)).toBe(4);
  })
});