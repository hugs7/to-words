import { describe, expect, test } from 'vitest';
import { cloneDeep } from 'lodash';
import { ToWords } from '../src/ToWords';
import lvLV from '../src/locales/lv-LV';

const localeCode = 'lv-LV';
const toWords = new ToWords({
  localeCode,
});

describe('Test Locale', () => {
  test(`Locale Class: ${localeCode}`, () => {
    expect(toWords.getLocaleClass()).toBe(lvLV);
  });

  const wrongLocaleCode = localeCode + '-wrong';
  test(`Wrong Locale: ${wrongLocaleCode}`, () => {
    const toWordsWrongLocale = new ToWords({
      localeCode: wrongLocaleCode,
    });
    expect(() => toWordsWrongLocale.convert(1)).toThrow(/Unknown Locale/);
  });
});

const testIntegers = [
  [0, 'nulle'],
  [137, 'simtu trīsdesmit septiņi'],
  [700, 'septiņi simti'],
  [4680, 'četri tūkstoši seši simti astoņdesmit'],
  [63892, 'sešdesmit trīs tūkstoši astoņi simti deviņdesmit divi'],
  [792581, 'septiņi simti deviņdesmit divi tūkstoši pieci simti astoņdesmit viens'],
  [1234567, 'viens miljons divi simti trīsdesmit četri tūkstoši pieci simti sešdesmit septiņi'],
  [2741034, 'divi miljoni septiņi simti četrdesmit viens tūkstotis trīsdesmit četri'],
  [86429753, 'astoņdesmit seši miljoni četri simti divdesmit deviņi tūkstoši septiņi simti piecdesmit trīs'],
  [975310864, 'deviņi simti septiņdesmit pieci miljoni trīs simti desmit tūkstoši astoņi simti sešdesmit četri'],
  [
    9876543210,
    'deviņi miljardi astoņi simti septiņdesmit seši miljoni pieci simti četrdesmit trīs tūkstoši divi simti desmit',
  ],
  [
    98765432101,
    'deviņdesmit astoņi miljardi septiņi simti sešdesmit pieci miljoni četri simti trīsdesmit divi tūkstoši simtu viens',
  ],
  [
    987654321012,
    'deviņi simti astoņdesmit septiņi miljardi seši simti piecdesmit četri miljoni trīs simti divdesmit viens tūkstotis divpadsmit',
  ],
  [
    9876543210123,
    'deviņi triljoni astoņi simti septiņdesmit seši miljardi pieci simti četrdesmit trīs miljoni divi simti desmit tūkstoši simtu divdesmit trīs',
  ],
  [
    98765432101234,
    'deviņdesmit astoņi triljoni septiņi simti sešdesmit pieci miljardi četri simti trīsdesmit divi miljoni simtu viens tūkstotis divi simti trīsdesmit četri',
  ],
];

describe('Test Integers with options = {}', () => {
  test.each(testIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Negative Integers with options = {}', () => {
  const testNegativeIntegers = cloneDeep(testIntegers);
  testNegativeIntegers.map((row, i) => {
    if (i === 0) {
      return;
    }
    row[0] = -row[0];
    row[1] = `mīnus ${row[1]}`;
  });

  test.each(testNegativeIntegers)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} eiro`;
  });

  test.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, doNotAddOnly: true }', () => {
  const testIntegersWithCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrency.map((row) => {
    row[1] = `${row[1]} eiro`;
  });

  test.concurrent.each(testIntegersWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true, doNotAddOnly: true })).toBe(expected);
  });
});

describe('Test Integers with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testIntegersWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testIntegers);
  testIntegersWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    row[1] = i === 0 ? '' : `${row[1]} eiro`;
  });

  test.each(testIntegersWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

const testFloats = [
  [0.0, 'nulle'],
  [0.04, 'nulle komats nulle četri'],
  [0.0468, 'nulle komats nulle četri seši astoņi'],
  [0.4, 'nulle komats četri'],
  [0.63, 'nulle komats sešdesmit trīs'],
  [0.973, 'nulle komats deviņi simti septiņdesmit trīs'],
  [0.999, 'nulle komats deviņi simti deviņdesmit deviņi'],
  [37.06, 'trīsdesmit septiņi komats nulle seši'],
  [37.068, 'trīsdesmit septiņi komats nulle seši astoņi'],
  [37.68, 'trīsdesmit septiņi komats sešdesmit astoņi'],
  [37.683, 'trīsdesmit septiņi komats seši simti astoņdesmit trīs'],
];

describe('Test Floats with options = {}', () => {
  test.each(testFloats)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number)).toBe(expected);
  });
});

const testFloatsWithCurrency = [
  [0.0, `nulle eiro`],
  [0.04, `nulle eiro un četri centi`],
  [0.0468, `nulle eiro un pieci centi`],
  [0.4, `nulle eiro un četrdesmit centi`],
  [0.63, `nulle eiro un sešdesmit trīs centi`],
  [0.973, `nulle eiro un deviņdesmit septiņi centi`],
  [0.999, `viens eiro`],
  [37.06, `trīsdesmit septiņi eiro un seši centi`],
  [37.068, `trīsdesmit septiņi eiro un septiņi centi`],
  [37.68, `trīsdesmit septiņi eiro un sešdesmit astoņi centi`],
  [37.683, `trīsdesmit septiņi eiro un sešdesmit astoņi centi`],
];

describe('Test Floats with options = { currency: true }', () => {
  test.each(testFloatsWithCurrency)('convert %d => %s', (input, expected) => {
    expect(toWords.convert(input as number, { currency: true })).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrency = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrency[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrency.map((row, i) => {
    if (i === 0) {
      row[1] = '';
      return;
    }
    if (row[0] > 0 && row[0] < 1) {
      row[1] = (row[1] as string).replace(`nulle eiro un `, '');
    }
  });

  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrency)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreDecimal = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreDecimal.map((row) => {
    if (row[0] === 0.999) {
      row[1] = `nulle eiro`;
    } else {
      row[1] = (row[1] as string).replace(new RegExp(` un .* centi`), '');
    }
  });

  test.each(testFloatsWithCurrencyAndIgnoreDecimal)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});

describe('Test Floats with options = { currency: true, ignoreZeroCurrency: true, ignoreDecimal: true }', () => {
  const testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals = cloneDeep(testFloatsWithCurrency);
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals[0][1] = '';
  testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals.map((row) => {
    if (row[0] > 0 && row[0] < 1) {
      row[1] = '';
    }
    row[1] = (row[1] as string).replace(new RegExp(` un .* centi`), '');
  });

  test.each(testFloatsWithCurrencyAndIgnoreZeroCurrencyAndIgnoreDecimals)('convert %d => %s', (input, expected) => {
    expect(
      toWords.convert(input as number, {
        currency: true,
        ignoreZeroCurrency: true,
        ignoreDecimal: true,
      }),
    ).toBe(expected);
  });
});
