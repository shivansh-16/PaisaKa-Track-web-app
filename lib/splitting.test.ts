import { describe, it, expect } from 'vitest';
import { splitEqual, splitUnequal, splitPercentage, optimizeSettlements } from './splitting';

describe('splitting', () => {
	it('equal split distributes remainder', () => {
		const shares = splitEqual(100, ['a','b','c']);
		expect(shares.reduce((s, x) => s + x.amount, 0)).toBe(100);
		expect(shares.length).toBe(3);
	});

	it('unequal must sum to total when provided', () => {
		expect(() => splitUnequal([{ userId: 'a', amount: 60 }, { userId: 'b', amount: 50 }], 100)).toThrow();
		const ok = splitUnequal([{ userId: 'a', amount: 60 }, { userId: 'b', amount: 40 }], 100);
		expect(ok.length).toBe(2);
	});

	it('percentage splits must sum to 100', () => {
		expect(() => splitPercentage(100, [{ userId: 'a', percent: 70 }, { userId: 'b', percent: 20 }])).toThrow();
		const out = splitPercentage(100, [{ userId: 'a', percent: 50 }, { userId: 'b', percent: 50 }]);
		expect(out.reduce((s, x) => s + x.amount, 0)).toBe(100);
	});
});

describe('settlements', () => {
	it('optimizes simple case', () => {
		const settlements = optimizeSettlements({ a: 50, b: -30, c: -20 });
		expect(settlements.length).toBe(2);
		const total = settlements.reduce((s, x) => s + x.amount, 0);
		expect(total).toBe(50);
	});
});
