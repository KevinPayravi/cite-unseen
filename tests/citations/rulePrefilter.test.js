import test from 'node:test';
import assert from 'node:assert/strict';

import {
    buildRuleKeyMap,
    buildUrlKeySet,
    filterRulesByUrlKeys,
    getRulesForUrlKeys
} from '../../src/citations/rulePrefilter.js';

/**
 * Return sorted Set contents so key assertions read like ordinary arrays.
 *
 * @param {Set<string>} values - Set to convert.
 * @returns {string[]} Sorted values.
 */
function sortedSetValues(values) {
    return Array.from(values).sort();
}

/**
 * Return rule labels from a category in a filter result.
 * The tests attach labels to fixture rules only so the expected behavior can be
 * read without comparing whole rule objects.
 *
 * @param {Object} categorizedRules - Rules grouped by category.
 * @param {string} category - Category to read.
 * @returns {string[]} Rule labels in returned rule order.
 */
function labelsForCategory(categorizedRules, category) {
    return categorizedRules[category].map(rule => rule.label);
}

test('buildUrlKeySet creates separate keys for host suffixes, final labels, and interior hosts', () => {
    /**
     * The prefilter uses typed keys so normal domains, final-label rules, and
     * trailing-dot rules do not collapse into one ambiguous string bucket.
     */
    const urlKeySet = buildUrlKeySet([
        'https://news.service.gov.uk/path'
    ]);

    assert.deepEqual(sortedSetValues(urlKeySet.hostSuffixKeys), [
        'gov.uk',
        'news.service.gov.uk',
        'service.gov.uk'
    ]);
    assert.deepEqual(sortedSetValues(urlKeySet.finalLabelKeys), [
        'uk'
    ]);
    assert.deepEqual(sortedSetValues(urlKeySet.interiorHostKeys), [
        'gov',
        'news.service.gov',
        'service.gov'
    ]);
});

test('filterRulesByUrlKeys keeps only normal domain rules that exact URL matching confirms', () => {
    /**
     * The key lookup is only a prefilter. A rule still has to pass the exact
     * URL matcher before it appears in the filtered categorized rules.
     */
    const categorizedRules = {
        source: [
            { 'url': 'example.com', label: 'matching-domain' },
            { 'url': 'example.net', label: 'different-domain' },
            { 'url': 'example.com.evil.test', label: 'suffix-trick' }
        ]
    };
    const urls = ['https://www.example.com/article'];
    const result = filterRulesByUrlKeys(categorizedRules, {}, buildUrlKeySet(urls), urls);

    assert.deepEqual(labelsForCategory(result.categorizedRules, 'source'), [
        'matching-domain'
    ]);
});

test('filterRulesByUrlKeys preserves gov and gov. as different matching concepts', () => {
    /**
     * This is the main correctness risk in the prefilter. "gov" must survive
     * for nih.gov and not for gov.uk. "gov." must survive for gov.uk and not
     * for nih.gov.
     */
    const categorizedRules = {
        source: [
            { 'url': 'gov', label: 'final-gov' },
            { 'url': 'gov.', label: 'interior-gov' }
        ]
    };

    const nihUrls = ['https://nih.gov/report'];
    const nihResult = filterRulesByUrlKeys(categorizedRules, {}, buildUrlKeySet(nihUrls), nihUrls);
    assert.deepEqual(labelsForCategory(nihResult.categorizedRules, 'source'), [
        'final-gov'
    ]);

    const ukGovUrls = ['https://www.gov.uk/guidance'];
    const ukGovResult = filterRulesByUrlKeys(categorizedRules, {}, buildUrlKeySet(ukGovUrls), ukGovUrls);
    assert.deepEqual(labelsForCategory(ukGovResult.categorizedRules, 'source'), [
        'interior-gov'
    ]);
});

test('filterRulesByUrlKeys removes ignored domains before candidate rules are exact-checked', () => {
    /**
     * Ignored domains are user/category configuration. They should not be
     * indexed as candidates even when the page contains URLs that would match.
     */
    const categorizedRules = {
        source: [
            { 'url': 'example.com', label: 'allowed-domain' },
            { 'url': 'ignored.example.com', label: 'ignored-domain' }
        ]
    };
    const domainIgnore = {
        source: ['ignored.example.com']
    };
    const urls = [
        'https://example.com/article',
        'https://ignored.example.com/article'
    ];
    const result = filterRulesByUrlKeys(categorizedRules, domainIgnore, buildUrlKeySet(urls), urls);

    assert.deepEqual(labelsForCategory(result.categorizedRules, 'source'), [
        'allowed-domain'
    ]);
});

test('filterRulesByUrlKeys carries url_str rules through the miscellaneous candidate bucket', () => {
    /**
     * url_str rules do not have a domain key. They are kept in a miscellaneous
     * bucket and then filtered by exact raw substring matching.
     */
    const categorizedRules = {
        source: [
            { 'url_str': '/articles/', label: 'matching-substring' },
            { 'url_str': '/missing/', label: 'missing-substring' }
        ]
    };
    const urls = ['https://example.test/articles/final'];
    const result = filterRulesByUrlKeys(categorizedRules, {}, buildUrlKeySet(urls), urls);

    assert.deepEqual(labelsForCategory(result.categorizedRules, 'source'), [
        'matching-substring'
    ]);
});

test('getRulesForUrlKeys narrows a page rule map down to one citation URL', () => {
    /**
     * The optimized render path filters rules once for the whole page, builds a
     * smaller page rule map, and then looks up only the rules relevant to each
     * individual citation URL. This test mirrors that full flow.
     */
    const categorizedRules = {
        source: [
            { 'url': 'example.com', label: 'example-domain' },
            { 'url': 'gov', label: 'final-gov' },
            { 'url': 'gov.', label: 'interior-gov' },
            { 'url_str': '/tracked/', label: 'tracked-substring' }
        ]
    };
    const pageUrls = [
        'https://example.com/article',
        'https://nih.gov/report',
        'https://www.gov.uk/guidance',
        'https://other.test/tracked/item'
    ];
    const pageFilter = filterRulesByUrlKeys(categorizedRules, {}, buildUrlKeySet(pageUrls), pageUrls);
    const pageRuleKeyMap = buildRuleKeyMap(pageFilter.categorizedRules);

    const nihUrls = ['https://nih.gov/report'];
    const nihResult = getRulesForUrlKeys(pageRuleKeyMap, buildUrlKeySet(nihUrls), nihUrls);
    assert.deepEqual(labelsForCategory(nihResult.categorizedRules, 'source'), [
        'final-gov'
    ]);

    const ukGovUrls = ['https://www.gov.uk/guidance'];
    const ukGovResult = getRulesForUrlKeys(pageRuleKeyMap, buildUrlKeySet(ukGovUrls), ukGovUrls);
    assert.deepEqual(labelsForCategory(ukGovResult.categorizedRules, 'source'), [
        'interior-gov'
    ]);

    const trackedUrls = ['https://other.test/tracked/item'];
    const trackedResult = getRulesForUrlKeys(pageRuleKeyMap, buildUrlKeySet(trackedUrls), trackedUrls);
    assert.deepEqual(labelsForCategory(trackedResult.categorizedRules, 'source'), [
        'tracked-substring'
    ]);
});
