import { describe, expect, it } from 'vitest';
import { DEFAULT_SUUID_V1_LENGTH } from '../src/constants';
import { suuidv1 } from '../src/suuidv1';

describe('suuidv1', () => {
  it('should generate an ID with default length', () => {
    const id = suuidv1();
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

  it('should only use allowed characters after prefix and timestamp', () => {
    const prefix = 'p-';
    const id = suuidv1({ length: 30, prefix });
    // Remove prefix and timestamp (hex, always uppercase and numbers)
    const core = id.slice(prefix.length + 4);
    expect(/^[a-zA-Z0-9_]+$/.test(core)).toBe(true);
  });

  it('should generate different IDs on multiple calls', () => {
    const id1 = suuidv1();
    const id2 = suuidv1();
    expect(id1).not.toBe(id2);
  });

  it('should throw if length is less than 8', () => {
    expect(() => suuidv1({ length: 0 })).toThrow();
    expect(() => suuidv1({ length: -5 })).toThrow();
    expect(() => suuidv1({ length: 7 })).toThrow();
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

  it('should support usage in template string', () => {
    const id = suuidv1({ length: 10 });
    const message = `Your ID is: ${id}`;
    expect(message.includes(id)).toBe(true);
  });

  it('should generate multiple IDs with prefix and maintain uniqueness', () => {
    const set = new Set();
    for (let i = 0; i < 100; i++) {
      set.add(suuidv1({ length: 20, prefix: 'x-' }));
    }
    expect(set.size).toBe(100);
  });
});
