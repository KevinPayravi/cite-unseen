import test from 'node:test';
import assert from 'node:assert/strict';

import { parseCoinsString } from '../../src/citations/parser.js';

test('parseCoinsString parses a COinS string', () => {
    const coins = parseCoinsString(
        'rft.genre=article&rft.jtitle=Example+Times&rft.au=Jane+Doe&rft.au=John+Doe' +
        '&rft_id=https%3A%2F%2Fexample.com%2Fnews%2Farticle'
    );

    assert.deepEqual(coins, {
        'rft.genre': 'article',
        'rft.jtitle': 'Example Times',
        'rft.au': ['Jane Doe', 'John Doe'],
        'rft_id': 'https://example.com/news/article',
    });
});

test('parseCoinsString keeps encoded &, = and + inside a value', () => {
    const coins = parseCoinsString(
        'rft.pub=Foo+%26+Bar&rft.jtitle=Example%2B' +
        '&rft_id=https%3A%2F%2Fexample.com%2Fa%3Fx%3D1%26y%3D2'
    );

    assert.deepEqual(coins, {
        'rft.pub': 'Foo & Bar',
        'rft.jtitle': 'Example+',
        'rft_id': 'https://example.com/a?x=1&y=2',
    });
});
