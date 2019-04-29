const BesUtils = require('../index')

describe('Base functions', () => {
  test('isNaN()', () => {
    expect(
      BesUtils.isNaN()
    ).toEqual(true)
    expect(
      BesUtils.isNaN(0)
    ).toEqual(false)
    expect(
      BesUtils.isNaN(null)
    ).toEqual(false)
    expect(
      BesUtils.isNaN('')
    ).toEqual(false)
    expect(
      BesUtils.isNaN([])
    ).toEqual(false)
    expect(
      BesUtils.isNaN(-1)
    ).toEqual(false)
    expect(
      BesUtils.isNaN(true)
    ).toEqual(false)
    expect(
      BesUtils.isNaN(false)
    ).toEqual(false)
    expect(
      BesUtils.isNaN(undefined)
    ).toEqual(true)
    expect(
      BesUtils.isNaN({})
    ).toEqual(true)
    expect(
      BesUtils.isNaN('null')
    ).toEqual(true)
    expect(
      BesUtils.isNaN('NAN')
    ).toEqual(true)
    expect(
      BesUtils.isNaN(/\d/)
    ).toEqual(true)
    expect(
      BesUtils.isNaN(function () {})
    ).toEqual(true)
  })

  test('isFinite()', () => {
    expect(
      BesUtils.isFinite()
    ).toEqual(false)
    expect(
      BesUtils.isFinite(null)
    ).toEqual(false)
    expect(
      BesUtils.isFinite(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isFinite(NaN)
    ).toEqual(false)
    expect(
      BesUtils.isFinite({})
    ).toEqual(false)
    expect(
      BesUtils.isFinite([])
    ).toEqual(false)
    expect(
      BesUtils.isFinite(function () {})
    ).toEqual(false)
    expect(
      BesUtils.isFinite(/\d/)
    ).toEqual(false)
    expect(
      BesUtils.isFinite('num')
    ).toEqual(false)
    expect(
      BesUtils.isFinite('5')
    ).toEqual(false)
    expect(
      BesUtils.isFinite('')
    ).toEqual(false)
    expect(
      BesUtils.isFinite(-2)
    ).toEqual(true)
    expect(
      BesUtils.isFinite(0)
    ).toEqual(true)
    expect(
      BesUtils.isFinite(5)
    ).toEqual(true)
    expect(
      BesUtils.isFinite(2e64)
    ).toEqual(true)
  })

  test('isUndefined()', () => {
    expect(
      BesUtils.isUndefined(0)
    ).toEqual(false)
    expect(
      BesUtils.isUndefined(-2)
    ).toEqual(false)
    expect(
      BesUtils.isUndefined(false)
    ).toEqual(false)
    expect(
      BesUtils.isUndefined('')
    ).toEqual(false)
    expect(
      BesUtils.isUndefined({})
    ).toEqual(false)
    expect(
      BesUtils.isUndefined([])
    ).toEqual(false)
    expect(
      BesUtils.isUndefined(function () {})
    ).toEqual(false)
    expect(
      BesUtils.isUndefined(/\d/)
    ).toEqual(false)
    expect(
      BesUtils.isUndefined(null)
    ).toEqual(false)
    expect(
      BesUtils.isUndefined('null')
    ).toEqual(false)
    expect(
      BesUtils.isUndefined('undefined')
    ).toEqual(false)
    expect(
      BesUtils.isUndefined(undefined)
    ).toEqual(true)
    expect(
      BesUtils.isUndefined()
    ).toEqual(true)
  })

  test('isArray()', () => {
    let method = function () {
      expect(
        BesUtils.isArray(arguments)
      ).toEqual(false)
    }
    method()
    method(11, 22)
    expect(
      BesUtils.isArray(null)
    ).toEqual(false)
    expect(
      BesUtils.isArray(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isArray({})
    ).toEqual(false)
    expect(
      BesUtils.isArray(function () {})
    ).toEqual(false)
    expect(
      BesUtils.isArray(0)
    ).toEqual(false)
    expect(
      BesUtils.isArray(-2)
    ).toEqual(false)
    expect(
      BesUtils.isArray(false)
    ).toEqual(false)
    expect(
      BesUtils.isArray('false')
    ).toEqual(false)
    expect(
      BesUtils.isArray([])
    ).toEqual(true)
    expect(
      BesUtils.isArray([1, 2, 3])
    ).toEqual(true)
  })

  test('isFloat()', () => {
    expect(
      BesUtils.isFloat(null)
    ).toEqual(false)
    expect(
      BesUtils.isFloat('null')
    ).toEqual(false)
    expect(
      BesUtils.isFloat({})
    ).toEqual(false)
    expect(
      BesUtils.isFloat([])
    ).toEqual(false)
    expect(
      BesUtils.isFloat(function () {})
    ).toEqual(false)
    expect(
      BesUtils.isFloat(/1\.3/)
    ).toEqual(false)
    expect(
      BesUtils.isFloat(0)
    ).toEqual(false)
    expect(
      BesUtils.isFloat(3)
    ).toEqual(false)
    expect(
      BesUtils.isFloat(-1)
    ).toEqual(false)
    expect(
      BesUtils.isFloat('0')
    ).toEqual(false)
    expect(
      BesUtils.isFloat('3.9a')
    ).toEqual(false)
    expect(
      BesUtils.isFloat('1.3')
    ).toEqual(true)
    expect(
      BesUtils.isFloat(3.3)
    ).toEqual(true)
    expect(
      BesUtils.isFloat(-2.3)
    ).toEqual(true)
  })

  test('isInteger()', () => {
    expect(
      BesUtils.isInteger(null)
    ).toEqual(false)
    expect(
      BesUtils.isInteger([])
    ).toEqual(false)
    expect(
      BesUtils.isInteger({})
    ).toEqual(false)
    expect(
      BesUtils.isInteger(/123/)
    ).toEqual(false)
    expect(
      BesUtils.isInteger(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isInteger(null)
    ).toEqual(false)
    expect(
      BesUtils.isInteger('null')
    ).toEqual(false)
    expect(
      BesUtils.isInteger('undefined')
    ).toEqual(false)
    expect(
      BesUtils.isInteger(3.3)
    ).toEqual(false)
    expect(
      BesUtils.isInteger(-1.3)
    ).toEqual(false)
    expect(
      BesUtils.isInteger('3.4')
    ).toEqual(false)
    expect(
      BesUtils.isInteger('0')
    ).toEqual(true)
    expect(
      BesUtils.isInteger('3')
    ).toEqual(true)
    expect(
      BesUtils.isInteger('-5')
    ).toEqual(true)
    expect(
      BesUtils.isInteger(2)
    ).toEqual(true)
    expect(
      BesUtils.isInteger(-1)
    ).toEqual(true)
    expect(
      BesUtils.isInteger(0)
    ).toEqual(true)
  })

  test('isFunction()', () => {
    expect(
      BesUtils.isFunction('null')
    ).toEqual(false)
    expect(
      BesUtils.isFunction(null)
    ).toEqual(false)
    expect(
      BesUtils.isFunction(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isFunction(false)
    ).toEqual(false)
    expect(
      BesUtils.isFunction(0)
    ).toEqual(false)
    expect(
      BesUtils.isFunction(-1)
    ).toEqual(false)
    expect(
      BesUtils.isFunction([])
    ).toEqual(false)
    expect(
      BesUtils.isFunction({})
    ).toEqual(false)
    expect(
      BesUtils.isFunction(function () {})
    ).toEqual(true)
  })

  test('isBoolean()', () => {
    expect(
      BesUtils.isBoolean([])
    ).toEqual(false)
    expect(
      BesUtils.isBoolean({})
    ).toEqual(false)
    expect(
      BesUtils.isBoolean(null)
    ).toEqual(false)
    expect(
      BesUtils.isBoolean(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isBoolean('false')
    ).toEqual(false)
    expect(
      BesUtils.isBoolean(0)
    ).toEqual(false)
    expect(
      BesUtils.isBoolean(-1)
    ).toEqual(false)
    expect(
      BesUtils.isBoolean(true)
    ).toEqual(true)
  })

  test('isString()', () => {
    expect(
      BesUtils.isString(1)
    ).toEqual(false)
    expect(
      BesUtils.isString(0)
    ).toEqual(false)
    expect(
      BesUtils.isString(null)
    ).toEqual(false)
    expect(
      BesUtils.isString(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isString({})
    ).toEqual(false)
    expect(
      BesUtils.isString([])
    ).toEqual(false)
    expect(
      BesUtils.isString(/\d/)
    ).toEqual(false)
    expect(
      BesUtils.isString(function () {})
    ).toEqual(false)
    if (typeof Symbol !== 'undefined') {
      expect(
        BesUtils.isString(Symbol('abc'))
      ).toEqual(false)
    }
    expect(
      BesUtils.isString(true)
    ).toEqual(false)
    expect(
      BesUtils.isString('')
    ).toEqual(true)
    expect(
      BesUtils.isString('abc')
    ).toEqual(true)
  })

  test('isNumber()', () => {
    expect(
      BesUtils.isNumber(null)
    ).toEqual(false)
    expect(
      BesUtils.isNumber(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isNumber({})
    ).toEqual(false)
    expect(
      BesUtils.isNumber([])
    ).toEqual(false)
    expect(
      BesUtils.isNumber(function () {})
    ).toEqual(false)
    expect(
      BesUtils.isNumber(/123/)
    ).toEqual(false)
    expect(
      BesUtils.isNumber('1')
    ).toEqual(false)
    expect(
      BesUtils.isNumber(-1)
    ).toEqual(true)
    expect(
      BesUtils.isNumber(0)
    ).toEqual(true)
    expect(
      BesUtils.isNumber(9.3)
    ).toEqual(true)
  })

  test('isRegExp()', () => {
    expect(
      BesUtils.isRegExp(null)
    ).toEqual(false)
    expect(
      BesUtils.isRegExp(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isRegExp([])
    ).toEqual(false)
    expect(
      BesUtils.isRegExp({})
    ).toEqual(false)
    expect(
      BesUtils.isRegExp(function () {})
    ).toEqual(false)
    expect(
      BesUtils.isRegExp(-1)
    ).toEqual(false)
    expect(
      BesUtils.isRegExp('a')
    ).toEqual(false)
    expect(
      BesUtils.isRegExp(new RegExp('a'))
    ).toEqual(true)
    expect(
      BesUtils.isRegExp(/\d/)
    ).toEqual(true)
  })

  test('isObject()', () => {
    expect(
      BesUtils.isObject(123)
    ).toEqual(false)
    expect(
      BesUtils.isObject(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isObject('null')
    ).toEqual(false)
    expect(
      BesUtils.isObject(function () {})
    ).toEqual(false)
    expect(
      BesUtils.isObject(-1)
    ).toEqual(false)
    expect(
      BesUtils.isObject(false)
    ).toEqual(false)
    if (typeof Symbol !== 'undefined') {
      expect(
        BesUtils.isObject(Symbol('123'))
      ).toEqual(false)
    }
    expect(
      BesUtils.isObject(/\d/)
    ).toEqual(true)
    expect(
      BesUtils.isObject(null)
    ).toEqual(true)
    expect(
      BesUtils.isObject([])
    ).toEqual(true)
    expect(
      BesUtils.isObject({})
    ).toEqual(true)
  })

  test('isPlainObject()', () => {
    expect(
      BesUtils.isPlainObject()
    ).toEqual(false)
    expect(
      BesUtils.isPlainObject(null)
    ).toEqual(false)
    expect(
      BesUtils.isPlainObject(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isPlainObject(/\d/)
    ).toEqual(false)
    expect(
      BesUtils.isPlainObject(function () {})
    ).toEqual(false)
    expect(
      BesUtils.isPlainObject([])
    ).toEqual(false)
    expect(
      BesUtils.isPlainObject('')
    ).toEqual(false)
    expect(
      BesUtils.isPlainObject(-1)
    ).toEqual(false)
    expect(
      BesUtils.isPlainObject(123)
    ).toEqual(false)
    if (typeof Symbol !== 'undefined') {
      expect(
        BesUtils.isPlainObject(Symbol('123'))
      ).toEqual(false)
    }
    expect(
      BesUtils.isPlainObject({})
    ).toEqual(true)
  })

  test('isDate()', () => {
    expect(
      BesUtils.isDate()
    ).toEqual(false)
    expect(
      BesUtils.isDate('')
    ).toEqual(false)
    expect(
      BesUtils.isDate('2017-12-20')
    ).toEqual(false)
    expect(
      BesUtils.isDate('ue Dec 04 2018 15:02:06 GMT+0800')
    ).toEqual(false)
    expect(
      BesUtils.isDate(-1)
    ).toEqual(false)
    expect(
      BesUtils.isDate(0)
    ).toEqual(false)
    expect(
      BesUtils.isDate(null)
    ).toEqual(false)
    expect(
      BesUtils.isDate(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isDate([])
    ).toEqual(false)
    expect(
      BesUtils.isDate({})
    ).toEqual(false)
    expect(
      BesUtils.isDate(1514096716800)
    ).toEqual(false)
    expect(
      BesUtils.isDate(new Date())
    ).toEqual(true)
    expect(
      BesUtils.isDate(BesUtils.toStringDate('2017-12-20', 'yyyy-MM-dd'))
    ).toEqual(true)
  })

  test('isError()', () => {
    expect(
      BesUtils.isError()
    ).toEqual(false)
    expect(
      BesUtils.isError(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isError(null)
    ).toEqual(false)
    expect(
      BesUtils.isError({})
    ).toEqual(false)
    expect(
      BesUtils.isError([])
    ).toEqual(false)
    expect(
      BesUtils.isError(-1)
    ).toEqual(false)
    expect(
      BesUtils.isError(0)
    ).toEqual(false)
    expect(
      BesUtils.isError('')
    ).toEqual(false)
    expect(
      BesUtils.isError(function () {})
    ).toEqual(false)
    expect(
      BesUtils.isError(new TypeError('error'))
    ).toEqual(true)
    expect(
      BesUtils.isError(new Error('error'))
    ).toEqual(true)
  })

  test('isTypeError()', () => {
    expect(
      BesUtils.isTypeError()
    ).toEqual(false)
    expect(
      BesUtils.isTypeError(null)
    ).toEqual(false)
    expect(
      BesUtils.isTypeError(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isTypeError([])
    ).toEqual(false)
    expect(
      BesUtils.isTypeError({})
    ).toEqual(false)
    expect(
      BesUtils.isTypeError(-1)
    ).toEqual(false)
    expect(
      BesUtils.isTypeError(0)
    ).toEqual(false)
    expect(
      BesUtils.isTypeError('')
    ).toEqual(false)
    expect(
      BesUtils.isTypeError(function () {})
    ).toEqual(false)
    expect(
      BesUtils.isTypeError(new Error('error'))
    ).toEqual(false)
    expect(
      BesUtils.isTypeError(new TypeError('error'))
    ).toEqual(true)
  })

  test('isEmpty()', () => {
    expect(
      BesUtils.isEmpty([11])
    ).toEqual(false)
    expect(
      BesUtils.isEmpty({ a: 1 })
    ).toEqual(false)
    expect(
      BesUtils.isEmpty()
    ).toEqual(true)
    expect(
      BesUtils.isEmpty(0)
    ).toEqual(true)
    expect(
      BesUtils.isEmpty(-1)
    ).toEqual(true)
    expect(
      BesUtils.isEmpty('')
    ).toEqual(true)
    expect(
      BesUtils.isEmpty(false)
    ).toEqual(true)
    expect(
      BesUtils.isEmpty(null)
    ).toEqual(true)
    expect(
      BesUtils.isEmpty(undefined)
    ).toEqual(true)
    expect(
      BesUtils.isEmpty({})
    ).toEqual(true)
    expect(
      BesUtils.isEmpty([])
    ).toEqual(true)
    expect(
      BesUtils.isEmpty(/\d/)
    ).toEqual(true)
    expect(
      BesUtils.isEmpty(function () {})
    ).toEqual(true)
  })

  test('isNull()', () => {
    expect(
      BesUtils.isNull()
    ).toEqual(false)
    expect(
      BesUtils.isNull(0)
    ).toEqual(false)
    expect(
      BesUtils.isNull(false)
    ).toEqual(false)
    expect(
      BesUtils.isNull(function () {})
    ).toEqual(false)
    expect(
      BesUtils.isNull(/null/)
    ).toEqual(false)
    expect(
      BesUtils.isNull({})
    ).toEqual(false)
    expect(
      BesUtils.isNull([])
    ).toEqual(false)
    expect(
      BesUtils.isNull(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isNull('null')
    ).toEqual(false)
    expect(
      BesUtils.isNull('')
    ).toEqual(false)
    expect(
      BesUtils.isNull(null)
    ).toEqual(true)
  })

  test('isSymbol()', () => {
    expect(
      BesUtils.isSymbol()
    ).toEqual(false)
    expect(
      BesUtils.isSymbol(null)
    ).toEqual(false)
    expect(
      BesUtils.isSymbol(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isSymbol({})
    ).toEqual(false)
    expect(
      BesUtils.isSymbol([])
    ).toEqual(false)
    expect(
      BesUtils.isSymbol(0)
    ).toEqual(false)
    expect(
      BesUtils.isSymbol(-1)
    ).toEqual(false)
    expect(
      BesUtils.isSymbol(false)
    ).toEqual(false)
    expect(
      BesUtils.isSymbol(function () {})
    ).toEqual(false)
    expect(
      BesUtils.isSymbol('a')
    ).toEqual(false)
    if (typeof Symbol !== 'undefined') {
      expect(
        BesUtils.isSymbol(Symbol('a'))
      ).toEqual(true)
    }
  })

  test('isArguments()', () => {
    expect(
      BesUtils.isArguments()
    ).toEqual(false)
    expect(
      BesUtils.isArguments(null)
    ).toEqual(false)
    expect(
      BesUtils.isArguments(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isArguments()
    ).toEqual(false)
    expect(
      BesUtils.isArguments([])
    ).toEqual(false)
    expect(
      BesUtils.isArguments({})
    ).toEqual(false)
    expect(
      BesUtils.isArguments(0)
    ).toEqual(false)
    expect(
      BesUtils.isArguments(-1)
    ).toEqual(false)
    expect(
      BesUtils.isArguments(false)
    ).toEqual(false)
    expect(
      BesUtils.isArguments(function () {})
    ).toEqual(false)
    let method = function () {
      expect(
        BesUtils.isArguments(arguments)
      ).toEqual(true)
    }
    method()
  })

  test('isElement()', () => {
    expect(
      BesUtils.isElement()
    ).toEqual(false)
    expect(
      BesUtils.isElement(null)
    ).toEqual(false)
    expect(
      BesUtils.isElement(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isElement(-1)
    ).toEqual(false)
    expect(
      BesUtils.isElement(123)
    ).toEqual(false)
    expect(
      BesUtils.isElement(0)
    ).toEqual(false)
    expect(
      BesUtils.isElement('')
    ).toEqual(false)
    expect(
      BesUtils.isElement({})
    ).toEqual(false)
    expect(
      BesUtils.isElement([])
    ).toEqual(false)
    expect(
      BesUtils.isElement(function () {})
    ).toEqual(false)
  })

  test('isDocument()', () => {
    expect(
      BesUtils.isDocument()
    ).toEqual(false)
    expect(
      BesUtils.isDocument(null)
    ).toEqual(false)
    expect(
      BesUtils.isDocument(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isDocument(-1)
    ).toEqual(false)
    expect(
      BesUtils.isDocument(123)
    ).toEqual(false)
    expect(
      BesUtils.isDocument(0)
    ).toEqual(false)
    expect(
      BesUtils.isDocument('')
    ).toEqual(false)
    expect(
      BesUtils.isDocument({})
    ).toEqual(false)
    expect(
      BesUtils.isDocument([])
    ).toEqual(false)
    expect(
      BesUtils.isDocument(function () {})
    ).toEqual(false)
  })

  test('isWindow()', () => {
    expect(
      BesUtils.isWindow()
    ).toEqual(false)
    expect(
      BesUtils.isWindow(null)
    ).toEqual(false)
    expect(
      BesUtils.isWindow(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isWindow(-1)
    ).toEqual(false)
    expect(
      BesUtils.isWindow(123)
    ).toEqual(false)
    expect(
      BesUtils.isWindow(0)
    ).toEqual(false)
    expect(
      BesUtils.isWindow('')
    ).toEqual(false)
    expect(
      BesUtils.isWindow({})
    ).toEqual(false)
    expect(
      BesUtils.isWindow([])
    ).toEqual(false)
    expect(
      BesUtils.isWindow(function () {})
    ).toEqual(false)
  })

  test('isFormData()', () => {
    expect(
      BesUtils.isFormData()
    ).toEqual(false)
    expect(
      BesUtils.isFormData(null)
    ).toEqual(false)
    expect(
      BesUtils.isFormData(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isFormData(-1)
    ).toEqual(false)
    expect(
      BesUtils.isFormData(123)
    ).toEqual(false)
    expect(
      BesUtils.isFormData(0)
    ).toEqual(false)
    expect(
      BesUtils.isFormData('')
    ).toEqual(false)
    expect(
      BesUtils.isFormData({})
    ).toEqual(false)
    expect(
      BesUtils.isFormData([])
    ).toEqual(false)
    expect(
      BesUtils.isFormData('a=1')
    ).toEqual(false)
    expect(
      BesUtils.isFormData(new FormData())
    ).toEqual(true)
  })

  test('isMap()', () => {
    expect(
      BesUtils.isMap()
    ).toEqual(false)
    expect(
      BesUtils.isMap(null)
    ).toEqual(false)
    expect(
      BesUtils.isMap(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isMap(-1)
    ).toEqual(false)
    expect(
      BesUtils.isMap(123)
    ).toEqual(false)
    expect(
      BesUtils.isMap(0)
    ).toEqual(false)
    expect(
      BesUtils.isMap('')
    ).toEqual(false)
    expect(
      BesUtils.isMap({})
    ).toEqual(false)
    expect(
      BesUtils.isMap([])
    ).toEqual(false)
    expect(
      BesUtils.isMap(new Map())
    ).toEqual(true)
  })

  test('isWeakMap()', () => {
    expect(
      BesUtils.isWeakMap()
    ).toEqual(false)
    expect(
      BesUtils.isWeakMap(null)
    ).toEqual(false)
    expect(
      BesUtils.isWeakMap(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isWeakMap(-1)
    ).toEqual(false)
    expect(
      BesUtils.isWeakMap(123)
    ).toEqual(false)
    expect(
      BesUtils.isWeakMap(0)
    ).toEqual(false)
    expect(
      BesUtils.isWeakMap('')
    ).toEqual(false)
    expect(
      BesUtils.isWeakMap({})
    ).toEqual(false)
    expect(
      BesUtils.isWeakMap([])
    ).toEqual(false)
    expect(
      BesUtils.isWeakMap(new WeakMap())
    ).toEqual(true)
  })

  test('isSet()', () => {
    expect(
      BesUtils.isSet()
    ).toEqual(false)
    expect(
      BesUtils.isSet(null)
    ).toEqual(false)
    expect(
      BesUtils.isSet(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isSet(-1)
    ).toEqual(false)
    expect(
      BesUtils.isSet(123)
    ).toEqual(false)
    expect(
      BesUtils.isSet(0)
    ).toEqual(false)
    expect(
      BesUtils.isSet('')
    ).toEqual(false)
    expect(
      BesUtils.isSet({})
    ).toEqual(false)
    expect(
      BesUtils.isSet([])
    ).toEqual(false)
    expect(
      BesUtils.isSet(new Set())
    ).toEqual(true)
  })

  test('isWeakSet()', () => {
    expect(
      BesUtils.isWeakSet()
    ).toEqual(false)
    expect(
      BesUtils.isWeakSet(null)
    ).toEqual(false)
    expect(
      BesUtils.isWeakSet(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isWeakSet(-1)
    ).toEqual(false)
    expect(
      BesUtils.isWeakSet(123)
    ).toEqual(false)
    expect(
      BesUtils.isWeakSet(0)
    ).toEqual(false)
    expect(
      BesUtils.isWeakSet('')
    ).toEqual(false)
    expect(
      BesUtils.isWeakSet({})
    ).toEqual(false)
    expect(
      BesUtils.isWeakSet([])
    ).toEqual(false)
    expect(
      BesUtils.isWeakSet(new WeakSet())
    ).toEqual(true)
  })

  test('isLeapYear()', () => {
    expect(
      BesUtils.isLeapYear()
    ).toEqual(false)
    expect(
      BesUtils.isLeapYear(null)
    ).toEqual(false)
    expect(
      BesUtils.isLeapYear(undefined)
    ).toEqual(false)
    expect(
      BesUtils.isLeapYear([])
    ).toEqual(false)
    expect(
      BesUtils.isLeapYear({})
    ).toEqual(false)
    expect(
      BesUtils.isLeapYear(-1)
    ).toEqual(false)
    expect(
      BesUtils.isLeapYear(123)
    ).toEqual(false)
    expect(
      BesUtils.isLeapYear(0)
    ).toEqual(false)
    expect(
      BesUtils.isLeapYear('')
    ).toEqual(false)
    expect(
      BesUtils.isLeapYear('abc')
    ).toEqual(false)
    expect(
      BesUtils.isLeapYear('2018-12-01')
    ).toEqual(false)
    expect(
      BesUtils.isLeapYear('2020-12-01 10:30:30')
    ).toEqual(true)
    expect(
      BesUtils.isLeapYear(new Date(2012, 1, 1).getTime())
    ).toEqual(true)
    expect(
      BesUtils.isLeapYear(new Date(2020, 11, 1))
    ).toEqual(true)
  })

  test('isMatch()', () => {
    expect(
      BesUtils.isMatch()
    ).toEqual(true)
    expect(
      BesUtils.isMatch(null)
    ).toEqual(true)
    expect(
      BesUtils.isMatch(undefined)
    ).toEqual(true)
    expect(
      BesUtils.isMatch([])
    ).toEqual(true)
    expect(
      BesUtils.isMatch({})
    ).toEqual(true)
    expect(
      BesUtils.isMatch(-1)
    ).toEqual(true)
    expect(
      BesUtils.isMatch(0)
    ).toEqual(true)
    expect(
      BesUtils.isMatch('')
    ).toEqual(true)
    expect(
      BesUtils.isMatch('sbc')
    ).toEqual(true)
    expect(
      BesUtils.isMatch([], [])
    ).toEqual(true)
    expect(
      BesUtils.isMatch({}, {})
    ).toEqual(true)
    expect(
      BesUtils.isMatch({ a: 22 })
    ).toEqual(true)
    expect(
      BesUtils.isMatch([11, 22], [11])
    ).toEqual(true)
    expect(
      BesUtils.isMatch([22, 11], [11])
    ).toEqual(false)
    expect(
      BesUtils.isMatch([11], [33])
    ).toEqual(false)
    expect(
      BesUtils.isMatch([{ a: { bb: 33 } }], [{ a: { bb: 33 } }])
    ).toEqual(true)
    expect(
      BesUtils.isMatch({ aa: 11, bb: 22 }, { bb: 22 })
    ).toEqual(true)
    expect(
      BesUtils.isMatch({ aa: 11, bb: [1, 2, 3] }, { bb: [1, 2, 3] })
    ).toEqual(true)
  })

  test('isEqual()', () => {
    expect(
      BesUtils.isEqual(0)
    ).toEqual(false)
    expect(
      BesUtils.isEqual(false)
    ).toEqual(false)
    expect(
      BesUtils.isEqual(0, false)
    ).toEqual(false)
    expect(
      BesUtils.isEqual(undefined, false)
    ).toEqual(false)
    expect(
      BesUtils.isEqual(undefined, null)
    ).toEqual(false)
    expect(
      BesUtils.isEqual(null, false)
    ).toEqual(false)
    expect(
      BesUtils.isEqual(0, undefined)
    ).toEqual(false)
    expect(
      BesUtils.isEqual(undefined, 0)
    ).toEqual(false)
    expect(
      BesUtils.isEqual(false, 0)
    ).toEqual(false)
    expect(
      BesUtils.isEqual(/0/, 0)
    ).toEqual(false)
    expect(
      BesUtils.isEqual(true, 1)
    ).toEqual(false)
    expect(
      BesUtils.isEqual(false, true)
    ).toEqual(false)
    expect(
      BesUtils.isEqual({}, function () {})
    ).toEqual(false)
    expect(
      BesUtils.isEqual({}, [])
    ).toEqual(false)
    expect(
      BesUtils.isEqual({ 0: 1 }, [1])
    ).toEqual(false)
    expect(
      BesUtils.isEqual([undefined], [null])
    ).toEqual(false)
    expect(
      BesUtils.isEqual([11, 22], [22, 11])
    ).toEqual(false)
    expect(
      BesUtils.isEqual({ name: 'test1', list: [11, 33, { a: /\D/ }] }, { name: 'test1', list: [11, 33, { a: /\d/ }] })
    ).toEqual(false)
    expect(
      BesUtils.isEqual([11, 22, 33], [11, 22, 33])
    ).toEqual(true)
    expect(
      BesUtils.isEqual([11, '22', /\d/, false], [11, '22', new RegExp('\\d'), false])
    ).toEqual(true)
    expect(
      BesUtils.isEqual({ name: 'test1' }, { name: 'test1' })
    ).toEqual(true)
    expect(
      BesUtils.isEqual({ name: 'test1', list: [11, /\d/] }, { name: 'test1', list: [11, /\d/] })
    ).toEqual(true)
    expect(
      BesUtils.isEqual([{ a: 1, b: [{ aa: false }, { bb: new Date(2018, 1, 1) }] }, { c: /\D/, d: null }], [{ a: 1, b: [{ aa: false }, { bb: new Date(2018, 1, 1) }] }, { c: /\D/, d: null }])
    ).toEqual(true)
  })

  test('isEqualWith()', () => {
    expect(
      BesUtils.isEqualWith(0)
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith(false)
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith(0, false)
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith(undefined, false)
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith(undefined, null)
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith(null, false)
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith(0, undefined)
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith(undefined, 0)
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith(false, 0)
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith(/0/, 0)
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith(true, 1)
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith(false, true)
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith({}, function () {})
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith({}, [])
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith({ 0: 1 }, [1])
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith([undefined], [null])
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith([11, 22], [22, 11])
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith([11, 22], [22, 11], (v1, v2) => true)
    ).toEqual(true)
    expect(
      BesUtils.isEqualWith({ name: 'test1', list: [11, 33, { a: /\D/ }] }, { name: 'test1', list: [11, 33, { a: /\d/ }] })
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith([11, 22, 33], [11, 22, 33])
    ).toEqual(true)
    expect(
      BesUtils.isEqualWith([11, 22, 33], [11, 22, 33], (v1, v2) => false)
    ).toEqual(false)
    expect(
      BesUtils.isEqualWith([11, '22', /\d/, false], [11, '22', new RegExp('\\d'), false])
    ).toEqual(true)
    expect(
      BesUtils.isEqualWith({ name: 'test1' }, { name: 'test1' })
    ).toEqual(true)
    expect(
      BesUtils.isEqualWith({ name: 'test1', list: [11, /\d/] }, { name: 'test1', list: [11, /\d/] })
    ).toEqual(true)
    expect(
      BesUtils.isEqualWith([{ a: 1, b: [{ aa: false }, { bb: new Date(2018, 1, 1) }] }, { c: /\D/, d: null }], [{ a: 1, b: [{ aa: false }, { bb: new Date(2018, 1, 1) }] }, { c: /\D/, d: null }])
    ).toEqual(true)
  })

  test('property()', () => {
    let getName = BesUtils.property('name')
    expect(
      getName({ name: 'test11', age: 25, height: 176 })
    ).toEqual('test11')
    expect(
      getName({ age: 25, height: 176 })
    ).toEqual(undefined)
  })

  test('getType()', () => {
    expect(
      BesUtils.getType()
    ).toEqual('undefined')
    expect(
      BesUtils.getType(undefined)
    ).toEqual('undefined')
    expect(
      BesUtils.getType(null)
    ).toEqual('null')
    expect(
      BesUtils.getType('')
    ).toEqual('string')
    expect(
      BesUtils.getType('1')
    ).toEqual('string')
    expect(
      BesUtils.getType(1)
    ).toEqual('number')
    expect(
      BesUtils.getType(1547895990810)
    ).toEqual('number')
    expect(
      BesUtils.getType(new Date())
    ).toEqual('date')
    expect(
      BesUtils.getType([])
    ).toEqual('array')
    expect(
      BesUtils.getType([{}])
    ).toEqual('array')
    expect(
      BesUtils.getType(/\d/)
    ).toEqual('regexp')
    expect(
      BesUtils.getType(new RegExp('-'))
    ).toEqual('regexp')
    expect(
      BesUtils.getType({})
    ).toEqual('object')
    expect(
      BesUtils.getType(false)
    ).toEqual('boolean')
    expect(
      BesUtils.getType(true)
    ).toEqual('boolean')
    expect(
      BesUtils.getType(new Error())
    ).toEqual('error')
    expect(
      BesUtils.getType(new TypeError())
    ).toEqual('error')
    expect(
      BesUtils.getType(function () {})
    ).toEqual('function')
    let method = function () {
      expect(
        BesUtils.getType(arguments)
      ).toEqual('object')
    }
    method(11, 22)
    if (typeof Symbol !== 'undefined') {
      expect(
        BesUtils.getType(Symbol('name'))
      ).toEqual('symbol')
    }
  })

  test('uniqueId()', () => {
    expect(
      BesUtils.uniqueId()
    ).toEqual(1)
    expect(
      BesUtils.uniqueId()
    ).toEqual(2)
    expect(
      BesUtils.uniqueId('prefix_')
    ).toEqual('prefix_3')
  })

  test('getSize()', () => {
    expect(
      BesUtils.getSize(null)
    ).toEqual(0)
    expect(
      BesUtils.getSize(undefined)
    ).toEqual(0)
    expect(
      BesUtils.getSize('')
    ).toEqual(0)
    expect(
      BesUtils.getSize(false)
    ).toEqual(0)
    expect(
      BesUtils.getSize(-1)
    ).toEqual(0)
    expect(
      BesUtils.getSize(10)
    ).toEqual(0)
    expect(
      BesUtils.getSize(function () {})
    ).toEqual(0)
    expect(
      BesUtils.getSize('123')
    ).toEqual(3)
    expect(
      BesUtils.getSize([1, 3])
    ).toEqual(2)
    expect(
      BesUtils.getSize([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }])
    ).toEqual(4)
    expect(
      BesUtils.getSize({ a: 2, b: 5 })
    ).toEqual(2)
  })

  test('slice()', () => {
    expect(
      BesUtils.slice(-0)
    ).toEqual([])
    expect(
      BesUtils.slice(123)
    ).toEqual([])
    expect(
      BesUtils.slice(false)
    ).toEqual([])
    expect(
      BesUtils.slice({})
    ).toEqual([])
    expect(
      BesUtils.slice([])
    ).toEqual([])
    expect(
      BesUtils.slice([11, 22])
    ).toEqual([11, 22])
    expect(
      BesUtils.slice([11, 22, 33, 44], 1)
    ).toEqual([22, 33, 44])
    expect(
      BesUtils.slice([11, 22, 33, 44], 1, 3)
    ).toEqual([22, 33])
    let method = function () {
      expect(
        BesUtils.slice(arguments, 1, 3)
      ).toEqual([22, 33])
    }
    method(11, 22, 33, 44)
  })

  test('indexOf()', () => {
    expect(
      BesUtils.indexOf([11, 22, 33, 22])
    ).toEqual(-1)
    expect(
      BesUtils.indexOf([11, 22, 33, 22], 55)
    ).toEqual(-1)
    expect(
      BesUtils.indexOf({ a: 1, b: 3 })
    ).toEqual(-1)
    expect(
      BesUtils.indexOf({ a: 1, b: 3 }, 5)
    ).toEqual(-1)
    expect(
      BesUtils.indexOf({ a: 1, b: 3 }, 1)
    ).toEqual('a')
    expect(
      BesUtils.indexOf({ a: 1, b: 3 }, 3)
    ).toEqual('b')
    expect(
      BesUtils.indexOf([11, 22, 33, 22], 22)
    ).toEqual(1)
    expect(
      BesUtils.indexOf([11, 22, 33, 22], 33)
    ).toEqual(2)
  })

  test('lastIndexOf()', () => {
    expect(
      BesUtils.lastIndexOf([11, 22, 33, 22])
    ).toEqual(-1)
    expect(
      BesUtils.lastIndexOf([11, 22, 33, 22], 55)
    ).toEqual(-1)
    expect(
      BesUtils.lastIndexOf({ a: 1, b: 3 })
    ).toEqual(-1)
    expect(
      BesUtils.lastIndexOf({ a: 1, b: 3 }, 5)
    ).toEqual(-1)
    expect(
      BesUtils.lastIndexOf({ a: 1, b: 3 }, 1)
    ).toEqual('a')
    expect(
      BesUtils.lastIndexOf({ a: 1, b: 3 }, 3)
    ).toEqual('b')
    expect(
      BesUtils.lastIndexOf([11, 22, 33, 22], 22)
    ).toEqual(3)
    expect(
      BesUtils.lastIndexOf([11, 22, 33, 22], 33)
    ).toEqual(2)
  })

  test('findIndexOf()', () => {
    expect(
      BesUtils.findIndexOf([11, 22, 33, 22], item => item === 55)
    ).toEqual(-1)
    expect(
      BesUtils.findIndexOf({ a: 11, b: 22, c: 33 }, item => item === 55)
    ).toEqual(-1)
    expect(
      BesUtils.findIndexOf({ a: 11, b: 22, c: 33 }, item => item === 22)
    ).toEqual('b')
    expect(
      BesUtils.findIndexOf([11, 22, 33, 22], item => item === 22)
    ).toEqual(1)
  })

  test('findLastIndexOf()', () => {
    expect(
      BesUtils.findLastIndexOf([11, 22, 33, 22], item => item === 55)
    ).toEqual(-1)
    expect(
      BesUtils.findLastIndexOf({ a: 11, b: 22, c: 33 }, item => item === 55)
    ).toEqual(-1)
    expect(
      BesUtils.findLastIndexOf({ a: 11, b: 22, c: 33 }, item => item === 22)
    ).toEqual('b')
    expect(
      BesUtils.findLastIndexOf([11, 22, 33, 22], item => item === 22)
    ).toEqual(3)
  })

  test('includes()', () => {
    expect(
      BesUtils.includes([11])
    ).toEqual(false)
    expect(
      BesUtils.includes({})
    ).toEqual(false)
    expect(
      BesUtils.includes([], 22)
    ).toEqual(false)
    expect(
      BesUtils.includes({}, 22)
    ).toEqual(false)
    expect(
      BesUtils.includes([11], 22)
    ).toEqual(false)
    expect(
      BesUtils.includes({ a: 11, b: 22 }, 22)
    ).toEqual(true)
    expect(
      BesUtils.includes([11, 22], 22)
    ).toEqual(true)
  })

  test('assign()', () => {
    let obj1 = { bb: { b: 11 } }
    let obj2 = BesUtils.assign(obj1, { a: 11 })
    expect(
      obj1.bb === obj2.bb
    ).toEqual(true)
    expect(
      obj1.bb === obj2.bb
    ).toEqual(true)
    obj1 = { bb: { b: 11 } }
    obj2 = BesUtils.extend(true, obj1, { a: 11 })
    expect(
      obj1 === obj2
    ).toEqual(false)
    expect(
      obj1.bb === obj2.bb
    ).toEqual(false)
  })

  test('toStringJSON()', () => {
    expect(
      BesUtils.toStringJSON('{"a":1}')
    ).toEqual({ a: 1 })
    expect(
      BesUtils.toStringJSON('[11,22]')
    ).toEqual([11, 22])
  })

  test('toJSONString()', () => {
    expect(
      BesUtils.toJSONString({ a: 1 })
    ).toEqual('{"a":1}')
    expect(
      BesUtils.toJSONString([11, 22])
    ).toEqual('[11,22]')
  })

  test('keys()', () => {
    expect(
      BesUtils.keys()
    ).toEqual([])
    expect(
      BesUtils.keys('')
    ).toEqual([])
    expect(
      BesUtils.keys(false)
    ).toEqual([])
    expect(
      BesUtils.keys({})
    ).toEqual([])
    expect(
      BesUtils.keys(-1)
    ).toEqual([])
    expect(
      BesUtils.keys(123)
    ).toEqual([])
    expect(
      BesUtils.keys({ a: 11, b: 22 })
    ).toEqual(['a', 'b'])
    expect(
      BesUtils.keys([{ a: 11 }, { a: 22 }, { a: 33 }])
    ).toEqual(['0', '1', '2'])
    expect(
      BesUtils.keys([11, 22])
    ).toEqual(['0', '1'])
    expect(
      BesUtils.keys('123')
    ).toEqual(['0', '1', '2'])
  })

  test('values()', () => {
    expect(
      BesUtils.values()
    ).toEqual([])
    expect(
      BesUtils.values('')
    ).toEqual([])
    expect(
      BesUtils.values(false)
    ).toEqual([])
    expect(
      BesUtils.values({})
    ).toEqual([])
    expect(
      BesUtils.values(-1)
    ).toEqual([])
    expect(
      BesUtils.values(123)
    ).toEqual([])
    expect(
      BesUtils.values({ a: 11, b: 22 })
    ).toEqual([11, 22])
    expect(
      BesUtils.values([{ a: 11 }, { a: 22 }, { a: 33 }])
    ).toEqual([{ a: 11 }, { a: 22 }, { a: 33 }])
    expect(
      BesUtils.values([11, 22])
    ).toEqual([11, 22])
    expect(
      BesUtils.values('123')
    ).toEqual(['1', '2', '3'])
  })

  test('entries()', () => {
    expect(
      BesUtils.entries()
    ).toEqual([])
    expect(
      BesUtils.entries('')
    ).toEqual([])
    expect(
      BesUtils.entries(false)
    ).toEqual([])
    expect(
      BesUtils.entries({})
    ).toEqual([])
    expect(
      BesUtils.entries(-1)
    ).toEqual([])
    expect(
      BesUtils.entries(123)
    ).toEqual([])
    expect(
      BesUtils.entries({ a: 11, b: 22 })
    ).toEqual([['a', 11], ['b', 22]])
    expect(
      BesUtils.entries([11, 22])
    ).toEqual([['0', 11], ['1', 22]])
    expect(
      BesUtils.entries('123')
    ).toEqual([['0', '1'], ['1', '2'], ['2', '3']])
  })

  test('pick()', () => {
    expect(
      BesUtils.pick({ name: 'test11', age: 25, height: 176 }, 'name', 'height')
    ).toEqual({ name: 'test11', height: 176 })
    expect(
      BesUtils.pick({ name: 'test11', age: 25, height: 176 }, ['name', 'age'])
    ).toEqual({ name: 'test11', age: 25 })
    expect(
      BesUtils.pick({ name: 'test11', age: 25, height: 176 }, val => BesUtils.isNumber(val))
    ).toEqual({ age: 25, height: 176 })
  })

  test('omit()', () => {
    expect(
      BesUtils.omit({ name: 'test11', age: 25, height: 176 }, 'name', 'height')
    ).toEqual({ age: 25 })
    expect(
      BesUtils.omit({ name: 'test11', age: 25, height: 176 }, ['name', 'age'])
    ).toEqual({ height: 176 })
    expect(
      BesUtils.omit({ name: 'test11', age: 25, height: 176 }, val => BesUtils.isNumber(val))
    ).toEqual({ name: 'test11' })
  })

  test('first()', () => {
    expect(
      BesUtils.first()
    ).toEqual(undefined)
    expect(
      BesUtils.first(undefined)
    ).toEqual(undefined)
    expect(
      BesUtils.first(null)
    ).toEqual(undefined)
    expect(
      BesUtils.first(123)
    ).toEqual(undefined)
    expect(
      BesUtils.first(true)
    ).toEqual(undefined)
    expect(
      BesUtils.first({})
    ).toEqual(undefined)
    expect(
      BesUtils.first([])
    ).toEqual(undefined)
    expect(
      BesUtils.first('123')
    ).toEqual('1')
    expect(
      BesUtils.first({ a: 11, b: 22 })
    ).toEqual(11)
    expect(
      BesUtils.first([11, 22])
    ).toEqual(11)
  })

  test('last()', () => {
    expect(
      BesUtils.last()
    ).toEqual(undefined)
    expect(
      BesUtils.last(undefined)
    ).toEqual(undefined)
    expect(
      BesUtils.last(null)
    ).toEqual(undefined)
    expect(
      BesUtils.last(123)
    ).toEqual(undefined)
    expect(
      BesUtils.last(true)
    ).toEqual(undefined)
    expect(
      BesUtils.last({})
    ).toEqual(undefined)
    expect(
      BesUtils.last([])
    ).toEqual(undefined)
    expect(
      BesUtils.last('123')
    ).toEqual('3')
    expect(
      BesUtils.last({ a: 11, b: 22 })
    ).toEqual(22)
    expect(
      BesUtils.last([11, 22])
    ).toEqual(22)
  })

  test('each()', () => {
    let rest = []
    BesUtils.each([11, 22, 33], (item, key, obj) => {
      rest.push([item, key])
    })
    expect(
      rest
    ).toEqual([[11, 0], [22, 1], [33, 2]])
    rest = []
    BesUtils.each({ a: 11, b: 22, c: 33 }, (item, key, obj) => {
      rest.push([item, key])
    })
    expect(
      rest
    ).toEqual([[11, 'a'], [22, 'b'], [33, 'c']])
    rest = []
    BesUtils.each('12345', (item, key, obj) => {
      rest.push([item, key])
    })
    expect(
      rest
    ).toEqual([['1', '0'], ['2', '1'], ['3', '2'], ['4', '3'], ['5', '4']])
  })

  test('lastEach()', () => {
    let rest = []
    BesUtils.lastEach([11, 22, 33], (item, key, obj) => {
      rest.push([item, key])
    })
    expect(
      rest
    ).toEqual([[33, 2], [22, 1], [11, 0]])
    rest = []
    BesUtils.lastEach({ a: 11, b: 22, c: 33 }, (item, key, obj) => {
      rest.push([item, key])
    })
    expect(
      rest
    ).toEqual([[33, 'c'], [22, 'b'], [11, 'a']])
    rest = []
    BesUtils.lastEach('12345', (item, key, obj) => {
      rest.push([item, key])
    })
    expect(
      rest
    ).toEqual([['5', '4'], ['4', '3'], ['3', '2'], ['2', '1'], ['1', '0']])
  })

  test('has()', () => {
    expect(
      BesUtils.has()
    ).toEqual(false)
    expect(
      BesUtils.has('123')
    ).toEqual(false)
    expect(
      BesUtils.has(null)
    ).toEqual(false)
    expect(
      BesUtils.has({ a: { b: 11, c: 22, d: [33, 44] } })
    ).toEqual(false)
    expect(
      BesUtils.has({ a: { b: 11, c: 22, d: [33, 44] } }, null)
    ).toEqual(false)
    expect(
      BesUtils.has({ a: { b: 11, c: 22, d: [33, 44] } }, undefined)
    ).toEqual(false)
    expect(
      BesUtils.has({ a: { b: 11, c: 22, d: [33, 44] } }, '')
    ).toEqual(false)
    expect(
      BesUtils.has({ a: { b: 11, c: 22, d: [33, 44] } }, [])
    ).toEqual(false)
    expect(
      BesUtils.has({ a: { b: 11, c: 22, d: [33, 44] } }, 'a.d[3]')
    ).toEqual(false)
    expect(
      BesUtils.has('abc', '[2]')
    ).toEqual(true)
    expect(
      BesUtils.has('abc', [0])
    ).toEqual(true)
    expect(
      BesUtils.has([11, 22, 33], 1)
    ).toEqual(true)
    expect(
      BesUtils.has([{ a: 11, b: 22 }, { a: 33, b: 44 }], 1)
    ).toEqual(true)
    expect(
      BesUtils.has([{ a: 11, b: 22 }, { a: 33, b: 44 }], '[1]')
    ).toEqual(true)
    expect(
      BesUtils.has([{ a: 11, b: 22 }, { a: 33, b: 44 }], '[1].b')
    ).toEqual(true)
    expect(
      BesUtils.has({ a: { b: 11, c: 22, d: [33, 44] } }, 'a')
    ).toEqual(true)
    expect(
      BesUtils.has({ a: { b: 0, c: 22, d: [33, 44] } }, 'a.b')
    ).toEqual(true)
    expect(
      BesUtils.has({ a: { b: 11, c: 22, d: [33, 44] }, 'a.d': 333 }, 'a.d')
    ).toEqual(true)
    expect(
      BesUtils.has({ a: { c: 22, d: [33, 44] }, 'a.b': 333 }, 'a.b')
    ).toEqual(true)
    expect(
      BesUtils.has({ a: { b: 11, c: 22, d: [33, 44] } }, 'a.d')
    ).toEqual(true)
    expect(
      BesUtils.has({ a: { b: 11, c: 22, d: [null] } }, 'a.d[0]')
    ).toEqual(true)
    expect(
      BesUtils.has({ a: { b: 11, c: 22, d: [33, { f: 66 }] } }, 'a.d[1].f')
    ).toEqual(true)
    expect(
      BesUtils.has({ a: { b: 11, c: 22, d: [33, 44, 55, undefined] } }, 'a.d[3]')
    ).toEqual(true)
    expect(
      BesUtils.has({ a: { b: 11, c: undefined, d: [33, 44] } }, ['a', 'c'])
    ).toEqual(true)
    expect(
      BesUtils.has({ a: { b: 11, c: 22, d: [33, 44], e: 0 } }, ['a', 'e'])
    ).toEqual(true)
  })

  test('get()', () => {
    expect(
      BesUtils.get()
    ).toEqual(undefined)
    expect(
      BesUtils.get('123')
    ).toEqual(undefined)
    expect(
      BesUtils.get(null)
    ).toEqual(undefined)
    expect(
      BesUtils.get({ a: { b: 11, c: 22, d: [33, 44] } })
    ).toEqual(undefined)
    expect(
      BesUtils.get({ a: { b: 11, c: 22, d: [33, 44] } }, null)
    ).toEqual(undefined)
    expect(
      BesUtils.get({ a: { b: 11, c: 22, d: [33, 44] } }, undefined)
    ).toEqual(undefined)
    expect(
      BesUtils.get({ a: { b: 11, c: 22, d: [33, 44] } }, '')
    ).toEqual(undefined)
    expect(
      BesUtils.get({ a: { b: 11, c: 22, d: [33, 44] } }, [])
    ).toEqual(undefined)
    expect(
      BesUtils.get('abc', '[2]')
    ).toEqual('c')
    expect(
      BesUtils.get('abc', [0])
    ).toEqual('a')
    expect(
      BesUtils.get([11, 22, 33], 1)
    ).toEqual(22)
    expect(
      BesUtils.get([{ a: 11, b: 22 }, { a: 33, b: 44 }], 1)
    ).toEqual({ a: 33, b: 44 })
    expect(
      BesUtils.get([{ a: 11, b: 22 }, { a: 33, b: 44 }], '[1]')
    ).toEqual({ a: 33, b: 44 })
    expect(
      BesUtils.get([{ a: 11, b: 22 }, { a: 33, b: 44 }], '[1].b')
    ).toEqual(44)
    expect(
      BesUtils.get({ a: { b: 11, c: 22, d: [33, 44] } }, 'a')
    ).toEqual({ b: 11, c: 22, d: [33, 44] })
    expect(
      BesUtils.get({ a: { b: 11, c: 22, d: [33, 44] } }, 'a.b')
    ).toEqual(11)
    expect(
      BesUtils.get({ a: { b: 11, c: 22, d: [33, 44] }, 'a.b': 333 }, 'a.b')
    ).toEqual(333)
    expect(
      BesUtils.get({ a: { b: 11, c: 22, d: [33, 44] } }, 'a.d')
    ).toEqual([33, 44])
    expect(
      BesUtils.get({ a: { b: 11, c: 22, d: [33, 44] } }, 'a.d[0]')
    ).toEqual(33)
    expect(
      BesUtils.get({ a: { b: 11, c: 22, d: [33, { f: 66 }] } }, 'a.d[1].f')
    ).toEqual(66)
    expect(
      BesUtils.get({ a: { b: 11, c: 22, d: [33, 44] } }, 'a.d[3]', '111')
    ).toEqual('111')
    expect(
      BesUtils.get({ a: { b: 11, c: 22, d: [33, 44] } }, ['a', 'c'], '222')
    ).toEqual(22)
    expect(
      BesUtils.get({ a: { b: 11, c: 22, d: [33, 44] } }, ['a', 'e'], '333')
    ).toEqual('333')
  })

  test('set()', () => {
    expect(
      BesUtils.set(null)
    ).toEqual(null)
    expect(
      BesUtils.set(undefined)
    ).toEqual(undefined)
    expect(
      BesUtils.set({})
    ).toEqual({})
    expect(
      BesUtils.set([])
    ).toEqual([])
    expect(
      BesUtils.set({ a: 11 }, null)
    ).toEqual({ a: 11 })
    expect(
      BesUtils.set([11])
    ).toEqual([11], null)
    expect(
      BesUtils.set({}, 'a', 11)
    ).toEqual({ a: 11 })
    expect(
      BesUtils.sum(BesUtils.set({ b: 22 }, 'a', 11))
    ).toEqual(33)
    expect(
      BesUtils.set({}, 'a.b', 11)
    ).toEqual({ a: { b: 11 } })
    expect(
      BesUtils.set({}, 'a.d[0]', 33)
    ).toEqual({ a: { d: [33] } })
    expect(
      BesUtils.set({ a: {} }, 'a.d[0].f.h', 44)
    ).toEqual({ a: { d: [{ f: { h: 44 } }] } })
    expect(
      BesUtils.set({}, 'a.d[0].f.h[0]', 55)
    ).toEqual({ a: { d: [{ f: { h: [55] } }] } })
    expect(
      BesUtils.set({}, ['a'], 11)
    ).toEqual({ a: 11 })
    expect(
      BesUtils.sum(BesUtils.set({ c: 33 }, ['a'], 11))
    ).toEqual(44)
    expect(
      BesUtils.set({}, ['a', 'c'], 22)
    ).toEqual({ a: { c: 22 } })
    expect(
      BesUtils.set({}, ['a', 'd[0]', 'f', 'h'], 44)
    ).toEqual({ a: { d: [{ f: { h: 44 } }] } })
    expect(
      BesUtils.set({ a: {} }, ['a', 'd[0]', 'f', 'h[0]'], 55)
    ).toEqual({ a: { d: [{ f: { h: [55] } }] } })
  })

  test('groupBy()', () => {
    expect(
      BesUtils.groupBy([{ type: 'a' }, { type: 'b' }], 'type')
    ).toEqual({ a: [{ type: 'a' }], b: [{ type: 'b' }] })
    expect(
      BesUtils.groupBy([{ type: 'a' }, { type: 'a' }, { type: 'b' }], 'type')
    ).toEqual({ a: [{ type: 'a' }, { type: 'a' }], b: [{ type: 'b' }] })
  })

  test('countBy()', () => {
    expect(
      BesUtils.countBy([{ type: 'a' }, { type: 'b' }], 'type')
    ).toEqual({ a: 1, b: 1 })
    expect(
      BesUtils.countBy([{ type: 'a' }, { type: 'a' }, { type: 'b' }], 'type')
    ).toEqual({ a: 2, b: 1 })
  })

  test('objectMap()', () => {
    expect(
      BesUtils.objectMap({ a: { type: 'a' }, b: { type: 'b' } }, item => item.type)
    ).toEqual({ a: 'a', b: 'b' })
    expect(
      BesUtils.objectMap([{ type: 'a' }, { type: 'b' }], item => item.type)
    ).toEqual({ 0: 'a', 1: 'b' })
    expect(
      BesUtils.objectMap([11, 22, 33], item => item)
    ).toEqual({ 0: 11, 1: 22, 2: 33 })
  })

  test('clone()', () => {
    let v1 = { a: 11, b: { b1: 22 } }
    let v2 = BesUtils.clone(v1)
    expect(
      v1.b === v2.b
    ).toEqual(true)
    let v3 = BesUtils.clone(v1, true)
    expect(
      v1.b === v3.b
    ).toEqual(false)
  })

  test('delay()', done => {
    BesUtils.delay(function (name) {
      expect(
        name
      ).toEqual('test11')
      done()
    }, 300, 'test11')
  })

  test('bind()', () => {
    let rest = BesUtils.bind(function (val) {
      return this.name + ' = ' + val
    }, { name: 'test' })
    expect(
      rest(222)
    ).toEqual('test = 222')
    expect(
      rest(333)
    ).toEqual('test = 333')
  })

  test('once()', () => {
    let rest = BesUtils.once(function (val) {
      return this.name + ' = ' + val
    }, { name: 'test' })
    expect(
      rest(222)
    ).toEqual('test = 222')
    expect(
      rest(333)
    ).toEqual('test = 222')
  })

  test('after()', done => {
    function getJSON (url, complete) {
      setTimeout(function () {
        complete({ data: url })
      }, 200)
    }
    let finish = BesUtils.after(3, function (rests) {
      expect(
        rests
      ).toEqual([{ data: '/api/list1' }, { data: '/api/list2' }, { data: '/api/list3' }])
      done()
    })
    getJSON('/api/list1', finish)
    getJSON('/api/list2', finish)
    getJSON('/api/list3', finish)
  })

  test('before()', done => {
    let meeting = BesUtils.before(4, function (rests, val) {
      if (val === 222) {
        expect(
          rests
        ).toEqual([111, 222])
        done()
      }
    })
    meeting(111)
    meeting(222)
    meeting(333)
    meeting(444)
  })

  test('clear()', () => {
    expect(
      BesUtils.clear([11, 22, 33, 33])
    ).toEqual([])
    expect(
      BesUtils.clear([11, 22, 33, 33], undefined)
    ).toEqual([undefined, undefined, undefined, undefined])
    expect(
      BesUtils.clear([11, 22, 33, 33], null)
    ).toEqual([null, null, null, null])
    expect(
      BesUtils.clear({ b1: 11, b2: 22 })
    ).toEqual({})
    expect(
      BesUtils.clear({ b1: 11, b2: 22 }, undefined)
    ).toEqual({ b1: undefined, b2: undefined })
    expect(
      BesUtils.clear({ b1: 11, b2: 22 }, null)
    ).toEqual({ b1: null, b2: null })
  })

  test('remove()', () => {
    let list = [11, 22, 33, 44]
    BesUtils.remove(list)
    expect(list).toEqual([])

    list = [11, 22, 33, 44]
    BesUtils.remove(list, 2)
    expect(list).toEqual([11, 22, 44])

    list = [11, 22, 33, 44]
    BesUtils.remove(list, '2')
    expect(list).toEqual([11, 22, 33, 44])

    list = [11, 22, 33, 44]
    BesUtils.remove(list, item => item === 22)
    expect(list).toEqual([11, 33, 44])

    let obj = { a: 11, b: 22, c: 33 }
    BesUtils.remove(obj)
    expect(obj).toEqual({})

    obj = { a: 11, b: 22, c: 33 }
    BesUtils.remove(obj, item => item === 22)
    expect(obj).toEqual({ a: 11, c: 33 })

    obj = { a: 11, b: 22, c: 33 }
    BesUtils.remove(obj, 'c')
    expect(obj).toEqual({ a: 11, b: 22 })

    obj = { a: 11, b: 22, c: 33, 2: 33 }
    BesUtils.remove(obj, 2)
    expect(obj).toEqual({ a: 11, b: 22, c: 33, 2: 33 })
  })

  test('range()', () => {
    expect(
      BesUtils.range(-5)
    ).toEqual([])
    expect(
      BesUtils.range(0)
    ).toEqual([])
    expect(
      BesUtils.range(10)
    ).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(
      BesUtils.range(-5, 5)
    ).toEqual([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4])
    expect(
      BesUtils.range(0, 10, 2)
    ).toEqual([0, 2, 4, 6, 8])
  })

  test('destructuring()', () => {
    expect(
      BesUtils.destructuring(null, { a: 11, b: 22, c: 33 })
    ).toEqual(null)
    expect(
      BesUtils.destructuring({}, { a: 11, b: 22, c: 33 })
    ).toEqual({})
    expect(
      BesUtils.destructuring({ a: null }, { a: 11, b: 22, c: 33 })
    ).toEqual({ a: 11 })
    expect(
      BesUtils.destructuring({ a: 11, d: 44 }, { a: 11, b: 22, c: 33 })
    ).toEqual({ a: 11, d: 44 })
    expect(
      BesUtils.destructuring({ a: 11, c: 33, d: 44 }, { a: 11, b: 22, c: null, e: 55, f: 66 })
    ).toEqual({ a: 11, c: null, d: 44 })
  })
})
