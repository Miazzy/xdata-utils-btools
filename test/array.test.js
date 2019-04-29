const BesUtils = require('../index')

describe('Array functions', () => {
  test('uniq()', () => {
    expect(
      BesUtils.uniq()
    ).toEqual([])
    expect(
      BesUtils.uniq(null)
    ).toEqual([])
    expect(
      BesUtils.uniq(undefined)
    ).toEqual([])
    expect(
      BesUtils.uniq(-1)
    ).toEqual([])
    expect(
      BesUtils.uniq(123)
    ).toEqual([])
    expect(
      BesUtils.uniq('')
    ).toEqual([])
    expect(
      BesUtils.uniq([])
    ).toEqual([])
    expect(
      BesUtils.uniq({})
    ).toEqual([])
    expect(
      BesUtils.uniq('abcb')
    ).toEqual(['a', 'b', 'c'])
    expect(
      BesUtils.uniq([11, 22, 33, 33, 22, '22'])
    ).toEqual([11, 22, 33, '22'])
    expect(
      BesUtils.uniq([11, 22, 33, 33, 22, 55])
    ).toEqual([11, 22, 33, 55])
    expect(
      BesUtils.uniq([11, 33, 33, { a: 11 }, { a: 11 }])
    ).toEqual([11, 33, { a: 11 }, { a: 11 }])
    let a1 = { a: 11 }
    expect(
      BesUtils.uniq([11, 33, 33, a1, a1])
    ).toEqual([11, 33, { a: 11 }])
  })

  test('union()', () => {
    expect(
      BesUtils.union()
    ).toEqual([])
    expect(
      BesUtils.union(0)
    ).toEqual([])
    expect(
      BesUtils.union(-1)
    ).toEqual([])
    expect(
      BesUtils.union(undefined)
    ).toEqual([])
    expect(
      BesUtils.union(null)
    ).toEqual([])
    expect(
      BesUtils.union({})
    ).toEqual([])
    expect(
      BesUtils.union([])
    ).toEqual([])
    expect(
      BesUtils.union([11, 22, 44, 11])
    ).toEqual([11, 22, 44])
    expect(
      BesUtils.union([11, 22, 44, 11], [11, 44])
    ).toEqual([11, 22, 44])
    expect(
      BesUtils.union([11, 22], [33, 22], [44, 11])
    ).toEqual([11, 22, 33, 44])
  })

  test('sortBy()', () => {
    expect(
      BesUtils.sortBy()
    ).toEqual([])
    expect(
      BesUtils.sortBy(null)
    ).toEqual([])
    expect(
      BesUtils.sortBy(undefined)
    ).toEqual([])
    expect(
      BesUtils.sortBy({})
    ).toEqual([])
    expect(
      BesUtils.sortBy(-1)
    ).toEqual([])
    expect(
      BesUtils.sortBy(123)
    ).toEqual([])
    expect(
      BesUtils.sortBy('abc')
    ).toEqual(['a', 'b', 'c'])
    expect(
      BesUtils.sortBy([11, 55, 99, 22])
    ).toEqual([11, 22, 55, 99])
    expect(
      BesUtils.sortBy([11, 55, 99, 77, 11, 55, 22], [])
    ).toEqual([11, 55, 99, 77, 11, 55, 22])
    expect(
      BesUtils.sortBy([11, 55, 99, 77, 11, 55, 22])
    ).toEqual([11, 11, 22, 55, 55, 77, 99])
    expect(
      BesUtils.sortBy([{ age: 27 }, { age: 26 }, { age: 28 }], 'age')
    ).toEqual([{ age: 26 }, { age: 27 }, { age: 28 }])
    expect(
      BesUtils.sortBy([{ age: 27 }, { age: 26 }, { age: 28 }], ['age'])
    ).toEqual([{ age: 26 }, { age: 27 }, { age: 28 }])
    expect(
      BesUtils.sortBy([{ a: { b: 66 } }, { a: { b: 33 } }, { a: { b: 11 } }], 'a.b')
    ).toEqual([{ a: { b: 11 } }, { a: { b: 33 } }, { a: { b: 66 } }])
    expect(
      BesUtils.sortBy([{ a: { b: 66 } }, { a: { b: 33 } }, { a: { b: 11 } }], ['a.b'])
    ).toEqual([{ a: { b: 11 } }, { a: { b: 33 } }, { a: { b: 66 } }])
    expect(
      BesUtils.sortBy([{ a: { b: 66 }, c: 6 }, { a: { b: 33 }, c: 9 }, { a: { b: 11 }, c: 6 }], ['c', 'a.b'])
    ).toEqual([{ a: { b: 11 }, c: 6 }, { a: { b: 66 }, c: 6 }, { a: { b: 33 }, c: 9 }])
    expect(
      BesUtils.sortBy([{ age: 27 }, { age: 26 }, { age: 28 }], item => item.age)
    ).toEqual([{ age: 26 }, { age: 27 }, { age: 28 }])
    expect(
      BesUtils.sortBy([{ name: 'x' }, { name: 'l' }, { name: 'a' }], [item => item.name])
    ).toEqual([{ name: 'a' }, { name: 'l' }, { name: 'x' }])
    expect(
      BesUtils.sortBy([
        { name: 'x', age: 25 },
        { name: 'd', age: 27 },
        { name: 'z', age: 27 },
        { name: 'x', age: 24 },
        { name: 'x', age: 26 },
        { name: 'z', age: 26 }
      ], ['name', 'age'])
    ).toEqual([
      { name: 'd', age: 27 },
      { name: 'x', age: 24 },
      { name: 'x', age: 25 },
      { name: 'x', age: 26 },
      { name: 'z', age: 26 },
      { name: 'z', age: 27 }
    ])
    expect(
      BesUtils.sortBy([
        { name: 'x', age: 26 },
        { name: 'd', age: 27 },
        { name: 'z', age: 26 },
        { name: 'z', age: 26 }
      ], ['age', 'name'])
    ).toEqual([
      { name: 'x', age: 26 },
      { name: 'z', age: 26 },
      { name: 'z', age: 26 },
      { name: 'd', age: 27 }
    ])
    expect(
      BesUtils.sortBy([
        { name: 'x', age: 26 },
        { name: 'd', age: 27 },
        { name: 'x', age: 26 },
        { name: 'z', age: 26 }
      ], [item => item.name, item => item.age])
    ).toEqual([
      { name: 'd', age: 27 },
      { name: 'x', age: 26 },
      { name: 'x', age: 26 },
      { name: 'z', age: 26 }
    ])
    expect(
      BesUtils.sortBy([
        { name: 'x', age: 26 },
        { name: 'd', age: 27 },
        { name: 'z', age: 26 },
        { name: 'z', age: 26 }]
      , ['age', item => item.name])
    ).toEqual([
      { name: 'x', age: 26 },
      { name: 'z', age: 26 },
      { name: 'z', age: 26 },
      { name: 'd', age: 27 }
    ])
    expect(
      BesUtils.sortBy([
        { name: 'x', age: 26, height: 176 },
        { name: 'd', age: 27, height: 176 },
        { name: 'z', age: 26, height: 178 },
        { name: 'z', age: 26, height: 176 },
        { name: 'd', age: 27, height: 175 }
      ], ['name', 'age', 'height'])
    ).toEqual([
      { name: 'd', age: 27, height: 175 },
      { name: 'd', age: 27, height: 176 },
      { name: 'x', age: 26, height: 176 },
      { name: 'z', age: 26, height: 176 },
      { name: 'z', age: 26, height: 178 }
    ])
  })

  test('shuffle()', () => {
    expect(
      BesUtils.shuffle()
    ).toEqual([])
    expect(
      BesUtils.shuffle(null)
    ).toEqual([])
    expect(
      BesUtils.shuffle(undefined)
    ).toEqual([])
    expect(
      BesUtils.shuffle([])
    ).toEqual([])
    expect(
      BesUtils.shuffle('abc').length
    ).toEqual(3)
    expect(
      BesUtils.shuffle([11, '22', 33, '44']).length
    ).toEqual(4)
    expect(
      BesUtils.shuffle([11, 22, 33, 44, 55]).length
    ).toEqual(5)
    expect(
      BesUtils.shuffle([{ a: 11 }, { b: 22 }, { c: 33 }]).length
    ).toEqual(3)
  })

  test('sample()', () => {
    expect(
      BesUtils.sample()
    ).toEqual(undefined)
    expect(
      BesUtils.sample(null)
    ).toEqual(undefined)
    expect(
      BesUtils.sample(undefined)
    ).toEqual(undefined)
    expect(
      BesUtils.sample({})
    ).toEqual(undefined)
    expect(
      BesUtils.sample(-1)
    ).toEqual(undefined)
    expect(
      BesUtils.sample([])
    ).toEqual(undefined)
    expect(
      BesUtils.sample(null, 4)
    ).toEqual([])
    expect(
      BesUtils.sample(undefined, 2)
    ).toEqual([])
    expect(
      BesUtils.sample({}, 2)
    ).toEqual([])
    expect(
      BesUtils.sample(-1, 3)
    ).toEqual([])
    expect(
      BesUtils.sample([], 2)
    ).toEqual([])
    expect(
      ['a', 'b', 'c'].includes(BesUtils.sample('abc'))
    ).toEqual(true)
    expect(
      BesUtils.sample('abc', 2).length
    ).toEqual(2)
    expect(
      [11, 22, 33, 44, 55].includes(BesUtils.sample([11, 22, 33, 44, 55]))
    ).toEqual(true)
    expect(
      BesUtils.sample([11, 22, 33, 44, 55], 2).length
    ).toEqual(2)
    expect(
      BesUtils.sample([11, 22, 33, 44, 55], 3).length
    ).toEqual(3)
  })

  test('some()', () => {
    expect(
      BesUtils.some()
    ).toEqual(false)
    expect(
      BesUtils.some(null)
    ).toEqual(false)
    expect(
      BesUtils.some(undefined)
    ).toEqual(false)
    expect(
      BesUtils.some({})
    ).toEqual(false)
    expect(
      BesUtils.some(123)
    ).toEqual(false)
    expect(
      BesUtils.some([])
    ).toEqual(false)
    expect(
      BesUtils.some('abc')
    ).toEqual(false)
    expect(
      BesUtils.some([{ value: 11 }, { value: 22 }], item => item.value === 55)
    ).toEqual(false)
    expect(
      BesUtils.some({ a: 11, b: 22, c: 33 }, item => item === 44)
    ).toEqual(false)
    expect(
      BesUtils.some(['a', 1, {}, 'b'], item => BesUtils.isString(item))
    ).toEqual(true)
    expect(
      BesUtils.some({ a: 11, b: 22, c: 33 }, item => item === 22)
    ).toEqual(true)
    expect(
      BesUtils.some('abc', item => item === 'b')
    ).toEqual(true)
    expect(
      BesUtils.some([{ value: 11 }, { value: 22 }], item => item.value > 10)
    ).toEqual(true)
  })

  test('every()', () => {
    expect(
      BesUtils.every()
    ).toEqual(true)
    expect(
      BesUtils.every(null)
    ).toEqual(true)
    expect(
      BesUtils.every(undefined)
    ).toEqual(true)
    expect(
      BesUtils.every({})
    ).toEqual(true)
    expect(
      BesUtils.every(123)
    ).toEqual(true)
    expect(
      BesUtils.every([])
    ).toEqual(true)
    expect(
      BesUtils.every('abc')
    ).toEqual(true)
    expect(
      BesUtils.every('abc', item => BesUtils.isString(item))
    ).toEqual(true)
    expect(
      BesUtils.every([{ value: 11 }, { value: 22 }], item => item.value >= 11)
    ).toEqual(true)
    expect(
      BesUtils.every(['a', 1, {}, 'b'], item => BesUtils.isString(item))
    ).toEqual(false)
    expect(
      BesUtils.every([{ value: 11 }, { value: 22 }], item => item.value === 11)
    ).toEqual(false)
  })

  test('filter()', () => {
    expect(
      BesUtils.filter()
    ).toEqual([])
    expect(
      BesUtils.filter(null)
    ).toEqual([])
    expect(
      BesUtils.filter(undefined)
    ).toEqual([])
    expect(
      BesUtils.filter({})
    ).toEqual([])
    expect(
      BesUtils.filter(123)
    ).toEqual([])
    expect(
      BesUtils.filter([])
    ).toEqual([])
    expect(
      BesUtils.filter('abc')
    ).toEqual([])
    expect(
      BesUtils.filter([])
    ).toEqual([])
    expect(
      BesUtils.filter({ a: 11, b: 22 }, item => item > 22)
    ).toEqual([])
    expect(
      BesUtils.filter('abc', item => ['b', 'c'].includes(item))
    ).toEqual(['b', 'c'])
    expect(
      BesUtils.filter({ a: 11, b: 22 }, item => item > 11)
    ).toEqual([22])
    expect(
      BesUtils.filter([{ value: 11 }, { value: 22 }], item => item.value > 33)
    ).toEqual([])
    expect(
      BesUtils.filter([{ value: 11 }, { value: 22 }], item => item.value > 11)
    ).toEqual([{ value: 22 }])
  })

  test('find()', () => {
    expect(
      BesUtils.find()
    ).toEqual(undefined)
    expect(
      BesUtils.find(null)
    ).toEqual(undefined)
    expect(
      BesUtils.find(undefined)
    ).toEqual(undefined)
    expect(
      BesUtils.find(-1)
    ).toEqual(undefined)
    expect(
      BesUtils.find(123)
    ).toEqual(undefined)
    expect(
      BesUtils.find('abc')
    ).toEqual(undefined)
    expect(
      BesUtils.find({})
    ).toEqual(undefined)
    expect(
      BesUtils.find([])
    ).toEqual(undefined)
    expect(
      BesUtils.find({ a: 11, b: 22, c: 33 }, item => item > 15)
    ).toEqual(22)
    expect(
      BesUtils.find([{ value: 11 }, { value: 22 }], item => item.value === 66)
    ).toEqual(undefined)
    expect(
      BesUtils.find([{ value: 11 }, { value: 22 }], item => item.value === 22)
    ).toEqual({ value: 22 })
  })

  test('findKey()', () => {
    expect(
      BesUtils.findKey()
    ).toEqual(undefined)
    expect(
      BesUtils.findKey([])
    ).toEqual(undefined)
    expect(
      BesUtils.findKey()
    ).toEqual(undefined)
    expect(
      BesUtils.findKey(null)
    ).toEqual(undefined)
    expect(
      BesUtils.findKey(undefined)
    ).toEqual(undefined)
    expect(
      BesUtils.findKey(-1)
    ).toEqual(undefined)
    expect(
      BesUtils.findKey(123)
    ).toEqual(undefined)
    expect(
      BesUtils.findKey('abc')
    ).toEqual(undefined)
    expect(
      BesUtils.findKey('abc', item => item === 'b')
    ).toEqual('1')
    expect(
      BesUtils.findKey([{ value: 11 }, { value: 22 }])
    ).toEqual(undefined)
    expect(
      BesUtils.findKey([{ value: 11 }, { value: 22 }], item => item.value === 22)
    ).toEqual('1')
    expect(
      BesUtils.findKey({ aa: 11, bb: 22, cc: 33 }, item => item === 22)
    ).toEqual('bb')
  })

  test('map()', () => {
    expect(
      BesUtils.map()
    ).toEqual([])
    expect(
      BesUtils.map(123)
    ).toEqual([])
    expect(
      BesUtils.map('abc')
    ).toEqual([])
    expect(
      BesUtils.map([])
    ).toEqual([])
    expect(
      BesUtils.map({})
    ).toEqual([])
    expect(
      BesUtils.map([], item => item.value)
    ).toEqual([])
    expect(
      BesUtils.map('abc', item => item)
    ).toEqual(['a', 'b', 'c'])
    expect(
      BesUtils.map({ a: 11, b: 22, c: 33 }, item => item)
    ).toEqual([11, 22, 33])
    expect(
      BesUtils.map([11, 22, 33], item => item * 2)
    ).toEqual([22, 44, 66])
    expect(
      BesUtils.map([{ value: 11 }, { value: 22 }], item => item.value)
    ).toEqual([11, 22])
  })

  test('sum()', () => {
    expect(
      BesUtils.sum()
    ).toEqual(0)
    expect(
      BesUtils.sum(10)
    ).toEqual(0)
    expect(
      BesUtils.sum(null)
    ).toEqual(0)
    expect(
      BesUtils.sum({})
    ).toEqual(0)
    expect(
      BesUtils.sum([])
    ).toEqual(0)
    expect(
      BesUtils.sum([22, 66, 88])
    ).toEqual(176)
    expect(
      BesUtils.sum([{ value: 11 }, { value: 22 }, { value: 66 }], 'value')
    ).toEqual(99)
    expect(
      BesUtils.sum({ val1: 21, val2: 34, val3: 47 })
    ).toEqual(102)
  })

  test('mean()', () => {
    expect(
      BesUtils.mean()
    ).toEqual(0)
    expect(
      BesUtils.mean(10)
    ).toEqual(0)
    expect(
      BesUtils.mean(null)
    ).toEqual(0)
    expect(
      BesUtils.mean([])
    ).toEqual(0)
    expect(
      BesUtils.mean({})
    ).toEqual(0)
    expect(
      BesUtils.mean({ val1: 21, val2: 34, val3: 47 })
    ).toEqual(34)
    expect(
      BesUtils.mean([22, 66, 60, 60])
    ).toEqual(52)
    expect(
      BesUtils.mean([{ value: 34 }, { value: 22 }], 'value')
    ).toEqual(28)
    expect(
      BesUtils.mean([{ value: 11 }, { value: 22 }, { value: 66 }], item => item.value * 2)
    ).toEqual(66)
    expect(
      BesUtils.mean({ val1: 21, val2: 34, val3: 45, val4: 55 })
    ).toEqual(38.75)
  })

  test('reduce()', () => {
    expect(
      BesUtils.reduce(null, (previous, item) => previous + item)
    ).toEqual(undefined)
    expect(
      BesUtils.reduce({}, (previous, item) => previous + item)
    ).toEqual(BesUtils.reduce({}, (previous, item) => previous + item))
    expect(
      BesUtils.reduce([], (previous, item) => previous + item)
    ).toEqual(BesUtils.reduce({}, (previous, item) => previous + item))
    expect(
      BesUtils.reduce([22, 66, 88], (previous, item) => previous + item)
    ).toEqual(176)
    expect(
      BesUtils.reduce([22, 66, 88], (previous, item) => previous + item, 0)
    ).toEqual(176)
    expect(
      BesUtils.reduce([{ num: 11 }, { num: 22 }, { num: 33 }], (previous, item) => previous + item.num, 0)
    ).toEqual(66)
  })

  test('copyWithin()', () => {
    expect(
      BesUtils.copyWithin([11, 22, 33, 44], 0, 2)
    ).toEqual([33, 44, 33, 44])
    expect(
      BesUtils.copyWithin([11, 22, 33, 44], 0, -1)
    ).toEqual([44, 22, 33, 44])
  })

  test('chunk()', () => {
    expect(
      BesUtils.chunk()
    ).toEqual([])
    expect(
      BesUtils.chunk(0)
    ).toEqual([])
    expect(
      BesUtils.chunk('')
    ).toEqual([])
    expect(
      BesUtils.chunk('123')
    ).toEqual([])
    expect(
      BesUtils.chunk(null)
    ).toEqual([])
    expect(
      BesUtils.chunk(undefined)
    ).toEqual([])
    expect(
      BesUtils.chunk({})
    ).toEqual([])
    expect(
      BesUtils.chunk([])
    ).toEqual([])
    expect(
      BesUtils.chunk(['a', 'b', 'c', 'd'])
    ).toEqual([['a'], ['b'], ['c'], ['d']])
    expect(
      BesUtils.chunk(['a', 'b', 'c', 'd'], 2)
    ).toEqual([['a', 'b'], ['c', 'd']])
    expect(
      BesUtils.chunk(['a', 'b', 'c', 'd'], 3)
    ).toEqual([['a', 'b', 'c'], ['d']])
  })

  test('zip()', () => {
    expect(
      BesUtils.zip(['name1', 'name2', 'name3'], [true, true, false], [30, 40, 20])
    ).toEqual([['name1', true, 30], ['name2', true, 40], ['name3', false, 20]])
  })

  test('unzip()', () => {
    expect(
      BesUtils.unzip([['name1', true, 30], ['name2', true, 40], ['name3', false, 20]])
    ).toEqual([['name1', 'name2', 'name3'], [true, true, false], [30, 40, 20]])
  })

  test('zipObject()', () => {
    expect(
      BesUtils.zipObject()
    ).toEqual({})
    expect(
      BesUtils.zipObject(null)
    ).toEqual({})
    expect(
      BesUtils.zipObject(undefined)
    ).toEqual({})
    expect(
      BesUtils.zipObject(false)
    ).toEqual({})
    expect(
      BesUtils.zipObject({})
    ).toEqual({})
    expect(
      BesUtils.zipObject([])
    ).toEqual({})
    expect(
      BesUtils.zipObject({ a: 'aa', b: 'bb' }, [11, 22, 33])
    ).toEqual({ aa: 11, bb: 22 })
    expect(
      BesUtils.zipObject({ 0: 'aa', 1: 'bb', 2: 'cc' }, [11, 22])
    ).toEqual({ aa: 11, bb: 22, cc: undefined })
    expect(
      BesUtils.zipObject(['aa', 'bb', 'cc'], [11, 22, 33])
    ).toEqual({ aa: 11, bb: 22, cc: 33 })
    expect(
      BesUtils.zipObject(['aa', 'bb', 'cc'], [11, 22])
    ).toEqual({ aa: 11, bb: 22, cc: undefined })
  })

  test('toArray()', () => {
    expect(
      BesUtils.toArray()
    ).toEqual([])
    expect(
      BesUtils.toArray(null)
    ).toEqual([])
    expect(
      BesUtils.toArray(undefined)
    ).toEqual([])
    expect(
      BesUtils.toArray(0)
    ).toEqual([])
    expect(
      BesUtils.toArray('')
    ).toEqual([])
    expect(
      BesUtils.toArray(true)
    ).toEqual([])
    expect(
      BesUtils.toArray(/1,2,3/)
    ).toEqual([])
    expect(
      BesUtils.toArray([])
    ).toEqual([])
    expect(
      BesUtils.toArray({})
    ).toEqual([])
    expect(
      BesUtils.toArray(10)
    ).toEqual([])
    expect(
      BesUtils.toArray(function () {})
    ).toEqual([])
    expect(
      BesUtils.toArray({ name: 'test1', age: 25 })
    ).toEqual(['test1', 25])
  })

  test('includeArrays()', () => {
    expect(
      BesUtils.includeArrays(null)
    ).toEqual(false)
    expect(
      BesUtils.includeArrays(null, null)
    ).toEqual(false)
    expect(
      BesUtils.includeArrays(null, undefined)
    ).toEqual(false)
    expect(
      BesUtils.includeArrays(undefined, null)
    ).toEqual(false)
    expect(
      BesUtils.includeArrays(undefined, undefined)
    ).toEqual(false)
    expect(
      BesUtils.includeArrays(null, [])
    ).toEqual(false)
    expect(
      BesUtils.includeArrays({}, [])
    ).toEqual(false)
    expect(
      BesUtils.includeArrays([], 0)
    ).toEqual(false)
    expect(
      BesUtils.includeArrays([], null)
    ).toEqual(false)
    expect(
      BesUtils.includeArrays([], {})
    ).toEqual(false)
    expect(
      BesUtils.includeArrays([11, 22, 33], { 0: 11, 1: 22 })
    ).toEqual(false)
    expect(
      BesUtils.includeArrays([11, 22, 33], [11, 22, 33, 44])
    ).toEqual(false)
    expect(
      BesUtils.includeArrays([], [])
    ).toEqual(true)
    expect(
      BesUtils.includeArrays([11, 22, 33], [])
    ).toEqual(true)
    expect(
      BesUtils.includeArrays([11, 22, 33], [11])
    ).toEqual(true)
    expect(
      BesUtils.includeArrays([11, 22, 33], [22, 33])
    ).toEqual(true)
    expect(
      BesUtils.includeArrays([11, 22, 33], [22, 44])
    ).toEqual(false)
  })

  test('pluck()', () => {
    expect(
      BesUtils.pluck([{ a: 11, b: 22 }, { a: 33, b: 44 }], 'a')
    ).toEqual([11, 33])
    expect(
      BesUtils.pluck([[11, 22, 33], [44, 55, 66]], 1)
    ).toEqual([22, 55])
  })

  test('invoke()', () => {
    expect(
      BesUtils.invoke([
        [3, 1, 6, 7],
        [3, 2, 1, 8],
        [3, 2, 5, 9, 6],
        [3, 3, 1, 2]
      ], 'sort')
    ).toEqual([
      [1, 3, 6, 7],
      [1, 2, 3, 8],
      [2, 3, 5, 6, 9],
      [1, 2, 3, 3]
    ])
    expect(
      BesUtils.invoke(['123', '456'], 'split')
    ).toEqual([['123'], ['456']])
    expect(
      BesUtils.invoke([123, 456], String.prototype.split, '')
    ).toEqual([['1', '2', '3'], ['4', '5', '6']])
    expect(
      BesUtils.invoke([{ a: { b: [2, 0, 1] } }, { a: { b: [2, 1] } }, { a: { b: [4, 8, 1] } }], ['a', 'b', 'sort'])
    ).toEqual([[0, 1, 2], [1, 2], [1, 4, 8]])
  })

  test('toArrayTree()', () => {
    let list1 = [
      { id: 1, name: '111' },
      { id: 2, parentId: 1, name: '222' },
      { id: 3, name: '333' },
      { id: 4, parentId: 2, name: '444' }
    ]
    expect(
      BesUtils.toArrayTree(list1)
    ).toEqual([
      {
        id: 1,
        name: '111',
        children: [
          {
            id: 2,
            parentId: 1,
            name: '222',
            children: [
              {
                id: 4,
                parentId: 2,
                name: '444',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 3,
        name: '333',
        children: []
      }
    ])
    let list2 = [
      { id: 1, name: '111', seq: 5 },
      { id: 2, parentId: 1, name: '222', seq: 3 },
      { id: 3, name: '333', seq: 6 },
      { id: 4, parentId: 2, name: '444', seq: 2 },
      { id: 5, parentId: 1, name: '555', seq: 1 }
    ]
    expect(
      BesUtils.toArrayTree(list2, { sortKey: 'seq' })
    ).toEqual([
      {
        id: 1,
        name: '111',
        seq: 5,
        children: [
          {
            id: 5,
            parentId: 1,
            name: '555',
            seq: 1,
            children: []
          },
          {
            id: 2,
            parentId: 1,
            name: '222',
            seq: 3,
            children: [
              {
                id: 4,
                parentId: 2,
                name: '444',
                seq: 2,
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 3,
        name: '333',
        seq: 6,
        children: []
      }
    ])
    let list3 = [
      { id: 1, name: '111' },
      { id: 2, parentId: 1, name: '222' },
      { id: 3, name: '333' },
      { id: 4, parentId: 2, name: '444' },
      { id: 5, parentId: 22, name: '555' }
    ]
    expect(
      BesUtils.toArrayTree(list3, { data: 'data' })
    ).toEqual([
      {
        data: { id: 1, name: '111' },
        id: 1,
        children: [
          {
            data: { id: 2, parentId: 1, name: '222' },
            id: 2,
            parentId: 1,
            children: [
              {
                data: { id: 4, parentId: 2, name: '444' },
                id: 4,
                parentId: 2,
                children: []
              }
            ]
          }
        ]
      },
      {
        data: { id: 3, name: '333' },
        id: 3,
        children: []
      },
      {
        data: { id: 5, parentId: 22, name: '555' },
        id: 5,
        parentId: 22,
        children: []
      }
    ])
    let list4 = [
      { id: 1, name: '111' },
      { id: 2, parentId: 1, name: '222' },
      { id: 3, name: '333' },
      { id: 4, parentId: 2, name: '444' },
      { id: 5, parentId: 22, name: '555' }
    ]
    expect(
      BesUtils.toArrayTree(list4, { strict: true, parentKey: 'parentId', key: 'id', children: 'children', data: 'data' })
    ).toEqual([
      {
        data: { id: 1, name: '111' },
        id: 1,
        children: [
          {
            data: { id: 2, parentId: 1, name: '222' },
            id: 2,
            parentId: 1,
            children: [
              {
                data: { id: 4, parentId: 2, name: '444' },
                id: 4,
                parentId: 2,
                children: []
              }
            ]
          }
        ]
      },
      {
        data: { id: 3, name: '333' },
        id: 3,
        children: []
      }
    ])
  })

  test('toTreeArray()', () => {
    let list1 = [
      {
        id: 1,
        name: '111',
        children: [
          {
            id: 2,
            parentId: 1,
            name: '222',
            children: [
              {
                id: 4,
                parentId: 2,
                name: '444',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 3,
        name: '333',
        children: []
      }
    ]
    expect(
      BesUtils.toTreeArray(list1)
    ).toEqual([
      list1[0],
      list1[0].children[0],
      list1[0].children[0].children[0],
      list1[1]
    ])
    let list2 = [
      {
        data: { id: 1, name: '111' },
        id: 1,
        children: [
          {
            data: { id: 2, parentId: 1, name: '222' },
            id: 2,
            parentId: 1,
            children: [
              {
                data: { id: 4, parentId: 2, name: '444' },
                id: 4,
                parentId: 2,
                children: []
              }
            ]
          }
        ]
      },
      {
        data: { id: 3, name: '333' },
        id: 3,
        children: []
      },
      {
        data: { id: 5, parentId: 22, name: '555' },
        id: 5,
        parentId: 22,
        children: []
      }
    ]
    expect(
      BesUtils.toTreeArray(list2, { data: 'data' })
    ).toEqual([
      { id: 1, name: '111' },
      { id: 2, parentId: 1, name: '222' },
      { id: 4, parentId: 2, name: '444' },
      { id: 3, name: '333' },
      { id: 5, parentId: 22, name: '555' }
    ])
  })

  test('findTree()', () => {
    let rest
    expect(
      BesUtils.findTree(0, item => item)
    ).toEqual(undefined)
    expect(
      BesUtils.findTree(null, item => item)
    ).toEqual(undefined)
    expect(
      BesUtils.findTree(undefined, item => item)
    ).toEqual(undefined)
    expect(
      BesUtils.findTree([], item => item)
    ).toEqual(undefined)
    rest = BesUtils.findTree([{ a: 11 }], item => item.a === 11)
    expect(rest.item).toEqual({ a: 11 })
    rest = BesUtils.findTree([{ a: 11 }, { a: 22 }, { a: 33, children: [{ a: 44 }] }], item => item.a === 44)
    expect(rest.item).toEqual({ a: 44 })
    rest = BesUtils.findTree([{ a: 11 }, { a: 22 }, { a: 33, childs: [{ a: 44 }] }], item => item.a === 44, { children: 'childs' })
    expect(rest.item).toEqual({ a: 44 })
  })

  test('eachTree()', () => {
    let rest = []
    BesUtils.eachTree([{ a: 11 }, { a: 22 }], item => {
      rest.push(item)
    })
    expect(rest).toEqual([{ a: 11 }, { a: 22 }])
    rest = []
    BesUtils.eachTree([{ a: 11 }, { a: 22, children: [{ a: 222 }, { a: 223 }] }], item => {
      rest.push(item)
    })
    expect(rest).toEqual([{ a: 11 }, { a: 22, children: [{ a: 222 }, { a: 223 }] }, { a: 222 }, { a: 223 }])
    rest = []
    BesUtils.eachTree([{ a: 11 }, { a: 22, childs: [{ a: 222 }, { a: 223 }] }], item => {
      rest.push(item)
    }, { children: 'childs' })
    expect(rest).toEqual([{ a: 11 }, { a: 22, childs: [{ a: 222 }, { a: 223 }] }, { a: 222 }, { a: 223 }])
  })

  test('mapTree()', () => {
    expect(
      BesUtils.mapTree([{ a: 11 }, { a: 22 }], item => {
        return item.a * 2
      })
    ).toEqual([22, 44])
    expect(
      BesUtils.mapTree([{ a: 11 }, { a: 22 }], item => {
        return { a: item.a * 2 }
      })
    ).toEqual([{ a: 22 }, { a: 44 }])
    expect(
      BesUtils.mapTree([{ a: 11 }, { a: 22, children: [{ a: 222 }, { a: 223 }] }], item => {
        return { a: item.a * 2 }
      })
    ).toEqual([{ a: 22 }, { a: 44, children: [{ a: 444 }, { a: 446 }] }])
    expect(
      BesUtils.mapTree([{ a: 11 }, { a: 22, childs: [{ a: 222 }, { a: 223 }] }], item => {
        return { a: item.a * 2 }
      }, { children: 'childs' })
    ).toEqual([{ a: 22 }, { a: 44, childs: [{ a: 444 }, { a: 446 }] }])
    expect(
      BesUtils.mapTree([{ a: 11 }, { a: 22, childs: [{ a: 222 }, { a: 223 }] }], item => {
        return { a: item.a * 2 }
      }, { children: 'childs', mapChildren: 'childs2' })
    ).toEqual([{ a: 22 }, { a: 44, childs2: [{ a: 444 }, { a: 446 }] }])
  })

  test('filterTree()', () => {
    expect(
      BesUtils.filterTree([{ a: 11 }, { a: 22 }], item => {
        return item.a === 33
      })
    ).toEqual([])
    expect(
      BesUtils.filterTree([{ a: 11 }, { a: 22 }], item => {
        return item.a === 11
      })
    ).toEqual([{ a: 11 }])
    expect(
      BesUtils.filterTree([{ a: 11 }, { a: 22, children: [{ a: 222 }, { a: 223 }] }], item => {
        return item.a >= 22
      })
    ).toEqual([{ a: 22, children: [{ a: 222 }, { a: 223 }] }, { a: 222 }, { a: 223 }])
    expect(
      BesUtils.filterTree([{ a: 11 }, { a: 22, childs: [{ a: 222 }, { a: 223 }] }], item => {
        return item.a >= 22
      }, { children: 'childs' })
    ).toEqual([{ a: 22, childs: [{ a: 222 }, { a: 223 }] }, { a: 222 }, { a: 223 }])
  })
})
