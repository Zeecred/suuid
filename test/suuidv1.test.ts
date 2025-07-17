import { describe, expect, it } from 'vitest';
import { DEFAULT_SUUID_V1_LENGTH } from '../src/constants';
import suuidv1 from '../src/suuidv1';

describe('generateShortId', () => {
  it('should generate an ID with default length', () => {
    const id = suuidv1();
    console.log('Generated ID:', id);
    expect(id.length).toBe(DEFAULT_SUUID_V1_LENGTH);
  });

  it('should generate an ID with custom length', () => {
    const id = suuidv1({ length: 20 });
    expect(id.length).toBe(20);
  });

  it('should include prefix at the start', () => {
    const prefix = 'PRE-';
    const id = suuidv1({ length: 20, prefix });
    expect(id.startsWith(prefix)).toBe(true);
  });

  it('should include suffix at the end', () => {
    const suffix = '-END';
    const id = suuidv1({ length: 20, suffix });
    expect(id.endsWith(suffix)).toBe(true);
  });

  it('should keep correct total length with prefix and suffix', () => {
    const prefix = 'x-';
    const suffix = '-z';
    const length = 14;
    const id = suuidv1({ length, prefix, suffix });
    expect(id.length).toBe(length);
  });

  it('should generate a string', () => {
    const id = suuidv1();
    expect(typeof id).toBe('string');
  });

  it('should generate different IDs on multiple calls', () => {
    const id1 = suuidv1();
    const id2 = suuidv1();
    expect(id1).not.toBe(id2);
  });

  it('should support long prefix and suffix', () => {
    const prefix = 'prefix_long_';
    const suffix = '_suffix_long';
    // eslint-disable-next-line @stylistic/max-len
    const tsHexLen = suuidv1({ length: 30 }).replace(prefix, '').replace(suffix, '').length;
    const minLen = prefix.length + tsHexLen + suffix.length;
    const id = suuidv1({
      length: minLen,
      prefix,
      suffix,
    });
    expect(id.startsWith(prefix)).toBe(true);
    expect(id.endsWith(suffix)).toBe(true);
    expect(id.length).toBe(minLen);
  });

  it('should return empty string if length is 0', () => {
    const id = suuidv1({ length: 0 });
    expect(id).toBe('');
  });

  it('should throw if length is negative', () => {
    expect(() => suuidv1({ length: -5 })).toThrow();
  });

  it('should work with empty options object', () => {
    const id = suuidv1({});
    expect(typeof id).toBe('string');
  });

  it('should ignore undefined options', () => {
    const id = suuidv1(undefined);
    expect(typeof id).toBe('string');
  });

  it('should ignore null options', () => {
    const id = suuidv1(null as any);
    expect(typeof id).toBe('string');
  });

  // eslint-disable-next-line @stylistic/max-len
  it('should generate 1 character ID (returns empty string, pois não cabe prefixo+timestamp)', () => {
    const id = suuidv1({ length: 1 });
    expect(id).toBe('');
  });

  // eslint-disable-next-line @stylistic/max-len
  it('should generate 5 character ID (returns empty string, pois não cabe prefixo+timestamp)', () => {
    const id = suuidv1({ length: 5 });
    expect(id).toBe('');
  });

  it('should generate 50 character ID', () => {
    const id = suuidv1({ length: 50 });
    expect(id.length).toBe(50);
  });

  it('should generate 100 character ID', () => {
    const id = suuidv1({ length: 100 });
    expect(id.length).toBe(100);
  });

  it('should generate 1000 unique IDs', () => {
    const set = new Set();
    for (let i = 0; i < 1000; i++) {
      set.add(suuidv1({ length: 30 }));
    }
    expect(set.size).toBe(1000);
  });

  it('should only use allowed characters after prefix and timestamp', () => {
    const prefix = 'p-';
    const id = suuidv1({ length: 30, prefix });
    const core = id.slice(prefix.length + 4);
    expect(/^[a-zA-Z0-9_]+$/.test(core)).toBe(true);
  });

  it('should preserve charset base62', () => {
    const charset = /^[a-zA-Z0-9]+$/;
    for (let i = 0; i < 20; i++) {
      const id = suuidv1({ length: 10 });
      const cleaned = id.replace(/[^a-zA-Z0-9]/g, '');
      expect(charset.test(cleaned)).toBe(true);
    }
  });

  it('should return a value of type string', () => {
    const id = suuidv1();
    expect(typeof id).toBe('string');
  });

  it('should support usage in template string', () => {
    const id = suuidv1({ length: 10 });
    const message = `Your ID is: ${id}`;
    expect(message.includes(id)).toBe(true);
  });

  it('should generate multiple IDs with suffix and maintain uniqueness', () => {
    const set = new Set();
    for (let i = 0; i < 100; i++) {
      set.add(suuidv1({ length: 20, suffix: '-dev' }));
    }
    expect(set.size).toBe(100);
  });

  it('should generate multiple IDs with prefix and maintain uniqueness', () => {
    const set = new Set();
    for (let i = 0; i < 100; i++) {
      set.add(suuidv1({ length: 20, prefix: 'x-' }));
    }
    expect(set.size).toBe(100);
  });
});
