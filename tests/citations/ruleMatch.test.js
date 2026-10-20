import test from 'node:test';
import assert from 'node:assert/strict';

import {
    findReliabilityMatch,
    match,
    matchUrl,
    matchUrlString
} from '../../src/citations/ruleMatch.js';
import { citeUnseenChecklists, citeUnseenChecklistPriorities } from '../../src/citations/sourceData.js';

/**
 * Create the smallest COinS-like object needed by the URL matchers.
 * Real citation objects contain many more fields, but these tests isolate the
 * rule-matching behavior that decides whether a citation URL belongs to a rule.
 *
 * @param {string|string[]} urls - Citation URL or URLs.
 * @param {Object} extraFields - Extra COinS fields used by constrained rules.
 * @returns {Object} COinS-like citation object.
 */
function createCoins(urls, extraFields = {}) {
    return {
        'rft_id': urls,
        ...extraFields
    };
}

/**
 * Create a reliability test fixture that mirrors the real checklist IDs.
 * Every checklist ID starts with an empty rule array, so a test can fill only
 * the categories it cares about without producing "not in the ruleset" logs.
 *
 * @returns {Object} Reliability fixture with categorized rules and enabled categories.
 */
function createReliabilityFixture() {
    const categorizedRules = {};
    const citeUnseenCategories = {};

    for (const [, checklists] of citeUnseenChecklists) {
        for (const [, checklistID] of checklists) {
            categorizedRules[checklistID] = [];
            citeUnseenCategories[checklistID] = true;
        }
    }

    return {
        categorizedRules,
        citeUnseenCategories
    };
}

/**
 * Find reliability matches using the real sourceData.js checklist order.
 *
 * @param {Object} coins - COinS-like citation object.
 * @param {Object} categorizedRules - Rules grouped by checklist category.
 * @param {Object} citeUnseenCategories - Enabled category map.
 * @returns {Object[]} Reliability match results.
 */
function findReliabilityMatches(coins, categorizedRules, citeUnseenCategories) {
    return findReliabilityMatch(coins, categorizedRules, {
        citeUnseenChecklists,
        citeUnseenCategories,
        citeUnseenChecklistPriorities,
        currentLanguage: 'en',
        showOtherLanguageReliabilityRatings: false
    });
}

test('matchUrl accepts a host and its subdomains but rejects unrelated suffix tricks', () => {
    /**
     * A normal domain rule should match the exact host and deeper subdomains.
     * It must not match strings that merely end with the same text, because
     * those are different domains controlled by someone else.
     */
    const rule = { 'url': 'example.com' };

    assert.equal(matchUrl(createCoins('https://example.com/article'), rule), true);
    assert.equal(matchUrl(createCoins('https://www.example.com/article'), rule), true);
    assert.equal(matchUrl(createCoins('https://news.www.example.com/article'), rule), true);
    assert.equal(matchUrl(createCoins('https://notexample.com/article'), rule), false);
    assert.equal(matchUrl(createCoins('https://example.com.evil.test/article'), rule), false);
});

test('matchUrl keeps final-label rules like gov separate from interior-label rules like gov.', () => {
    /**
     * "gov" means the hostname ends at .gov, as in United States government
     * sites. "gov." means gov has another hostname label after it, as in
     * gov.uk. These two rules intentionally do not match the same hosts.
     */
    const finalGovRule = { 'url': 'gov' };
    const interiorGovRule = { 'url': 'gov.' };

    assert.equal(matchUrl(createCoins('https://nih.gov/report'), finalGovRule), true);
    assert.equal(matchUrl(createCoins('https://www.gov.uk/guidance'), finalGovRule), false);

    assert.equal(matchUrl(createCoins('https://www.gov.uk/guidance'), interiorGovRule), true);
    assert.equal(matchUrl(createCoins('https://nih.gov/report'), interiorGovRule), false);
});

test('matchUrl applies exclude rules after the broad domain rule matches', () => {
    /**
     * Exclude rules are narrower URL rules. The broad source rule can match a
     * domain, and then the exclude list removes known exceptions under it.
     */
    const rule = {
        'url': 'example.com',
        'exclude': 'example.com/private example.com/ignored'
    };

    assert.equal(matchUrl(createCoins('https://example.com/public/article'), rule), true);
    assert.equal(matchUrl(createCoins('https://example.com/private/article'), rule), false);
    assert.equal(matchUrl(createCoins('https://example.com/ignored/article'), rule), false);
});

test('matchUrlString matches raw URL substrings and applies substring excludes', () => {
    /**
     * url_str rules are intentionally simpler than url rules: they scan the raw
     * URL string. Their exclude list also uses raw substring checks.
     */
    const rule = {
        'url_str': '/articles/',
        'exclude': '/articles/draft/'
    };

    assert.equal(matchUrlString(createCoins('https://example.test/articles/final'), rule), true);
    assert.equal(matchUrlString(createCoins('https://example.test/articles/draft/123'), rule), false);
    assert.equal(matchUrlString(createCoins('https://example.test/reports/final'), rule), false);
});

test('match ignores its own cached fields when the same constrained rule is reused', () => {
    /**
     * The matcher caches compiled regular expressions and date predicates on
     * the rule object. Those private _cached fields must not become extra rule
     * conditions on later calls.
     */
    const rule = {
        'url': 'example.com',
        'date': '>=2024-01'
    };
    const matchingCoins = createCoins('https://example.com/report', {
        'rft.date': '2024-03-15'
    });
    const staleCoins = createCoins('https://example.com/report', {
        'rft.date': '2023-12-31'
    });

    assert.equal(match(matchingCoins, rule), true);
    assert.equal(match(matchingCoins, rule), true);
    assert.equal(match(staleCoins, rule), false);
});

test('findReliabilityMatch reports multi when one list rates a source in two tiers', () => {
    /**
     * A list that puts the same domain in two tiers contradicts itself.
     * Show "multiple ratings" rather than let checklist order pick one.
     */
    const coins = createCoins('https://www.example.com/article');
    const {
        categorizedRules,
        citeUnseenCategories
    } = createReliabilityFixture();

    categorizedRules.enRspGenerallyUnreliable = [{ 'url': 'example.com' }];
    categorizedRules.enRspGenerallyReliable = [{ 'url': 'example.com' }];

    assert.deepEqual(findReliabilityMatches(coins, categorizedRules, citeUnseenCategories), [
        {
            type: 'multi',
            name: 'enRSP',
            language: 'en',
            spec: 0
        }
    ]);
});

test('findReliabilityMatch lets a more specific rule settle a conflict within one list', () => {
    /**
     * Within a list, a rule with an author condition beats a bare domain
     * rule in another tier, so the list is not reported as multi.
     */
    const coins = createCoins('https://www.example.com/article', { 'rft.au': 'Jane Doe' });
    const {
        categorizedRules,
        citeUnseenCategories
    } = createReliabilityFixture();

    categorizedRules.enRspMulti = [{ 'url': 'example.com' }];
    categorizedRules.enRspGenerallyReliable = [{ 'url': 'example.com', 'author': 'Jane Doe' }];

    assert.deepEqual(findReliabilityMatches(coins, categorizedRules, citeUnseenCategories), [
        {
            type: 'generallyReliable',
            name: 'enRSP',
            language: 'en',
            spec: 1.5
        }
    ]);
});

test('findReliabilityMatch keeps earlier checklist names within the same reliability category', () => {
    /**
     * sourceData.js lists enRSP before enVGS inside generallyReliable. If both
     * checklists contain an equal-specificity rule for the same URL, enRSP must
     * remain the selected match because it appears first.
     */
    const coins = createCoins('https://www.example.com/article');
    const {
        categorizedRules,
        citeUnseenCategories
    } = createReliabilityFixture();

    categorizedRules.enRspGenerallyReliable = [{ 'url': 'example.com' }];
    categorizedRules.enVgsGenerallyReliable = [{ 'url': 'example.com' }];

    assert.deepEqual(findReliabilityMatches(coins, categorizedRules, citeUnseenCategories), [
        {
            type: 'generallyReliable',
            name: 'enRSP',
            language: 'en',
            spec: 0
        }
    ]);
});

test('findReliabilityMatch lets a higher-priority multi rating beat a lower-priority tier', () => {
    /**
     * "No consensus" from enRSP is a real verdict. A lower-priority
     * WikiProject list must not override it.
     */
    const coins = createCoins('https://www.example.com/article');
    const {
        categorizedRules,
        citeUnseenCategories
    } = createReliabilityFixture();

    categorizedRules.enRspMulti = [{ 'url': 'example.com' }];
    categorizedRules.enAsGenerallyUnreliable = [{ 'url': 'example.com' }];

    assert.deepEqual(findReliabilityMatches(coins, categorizedRules, citeUnseenCategories), [
        {
            type: 'multi',
            name: 'enRSP',
            language: 'en',
            spec: 0
        }
    ]);
});

test('findReliabilityMatch lets a higher-priority blanket rule beat a dated rule from another list', () => {
    /**
     * Priority comes before specificity.
     * Undated enRSP rule should beat a dated rule from a lower-priority list.
     */
    const coins = createCoins('https://www.example.com/article', { 'rft.date': '2017-09-13' });
    const {
        categorizedRules,
        citeUnseenCategories
    } = createReliabilityFixture();

    categorizedRules.enRspGenerallyUnreliable = [{ 'url': 'example.com' }];
    categorizedRules.enVgsGenerallyReliable = [{ 'url': 'example.com', 'date': '>= 2010, <= 2022' }];

    assert.deepEqual(findReliabilityMatches(coins, categorizedRules, citeUnseenCategories), [
        {
            type: 'generallyUnreliable',
            name: 'enRSP',
            language: 'en',
            spec: 0
        }
    ]);
});
