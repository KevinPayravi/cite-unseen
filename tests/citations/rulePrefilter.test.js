import test from 'node:test';
import assert from 'node:assert/strict';

import {
    buildRuleKeyMap,
    buildUrlKeySet,
    getCandidateRulesForUrlKeys,
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

test('getRulesForUrlKeys keeps only normal domain rules that exact URL matching confirms', () => {
    /**
     * Citation-level filtering uses URL keys first, then exact URL matching.
     * Hostname suffix tricks should not survive the exact match.
     */
    const categorizedRules = {
        source: [
            { 'url': 'example.com', label: 'matching-domain' },
            { 'url': 'example.net', label: 'different-domain' },
            { 'url': 'example.com.evil.test', label: 'suffix-trick' }
        ]
    };
    const urls = ['https://www.example.com/article'];
    const ruleKeyMap = buildRuleKeyMap(categorizedRules);
    const result = getRulesForUrlKeys(ruleKeyMap, buildUrlKeySet(urls), urls);

    assert.deepEqual(labelsForCategory(result.categorizedRules, 'source'), [
        'matching-domain'
    ]);
});

test('getRulesForUrlKeys preserves gov and gov. as different matching concepts', () => {
    /**
     * This is the main correctness risk in the prefilter. "gov" must match
     * nih.gov and not gov.uk. "gov." must match gov.uk and not nih.gov.
     */
    const categorizedRules = {
        source: [
            { 'url': 'gov', label: 'final-gov' },
            { 'url': 'gov.', label: 'interior-gov' }
        ]
    };
    const ruleKeyMap = buildRuleKeyMap(categorizedRules);

    const nihUrls = ['https://nih.gov/report'];
    const nihResult = getRulesForUrlKeys(ruleKeyMap, buildUrlKeySet(nihUrls), nihUrls);
    assert.deepEqual(labelsForCategory(nihResult.categorizedRules, 'source'), [
        'final-gov'
    ]);

    const ukGovUrls = ['https://www.gov.uk/guidance'];
    const ukGovResult = getRulesForUrlKeys(ruleKeyMap, buildUrlKeySet(ukGovUrls), ukGovUrls);
    assert.deepEqual(labelsForCategory(ukGovResult.categorizedRules, 'source'), [
        'interior-gov'
    ]);
});

test('buildRuleKeyMap removes ignored domains before candidate rules are collected', () => {
    /**
     * Ignored domains are user/category configuration. They should not be
     * indexed as candidates even when the page contains URLs with their keys.
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
    const ruleKeyMap = buildRuleKeyMap(categorizedRules, domainIgnore);
    const result = getCandidateRulesForUrlKeys(ruleKeyMap, buildUrlKeySet(urls));

    assert.deepEqual(labelsForCategory(result.categorizedRules, 'source'), [
        'allowed-domain'
    ]);
});

test('getCandidateRulesForUrlKeys carries url_str rules through the miscellaneous candidate bucket', () => {
    /**
     * url_str rules do not have a domain key. They are kept in a miscellaneous
     * bucket during page-level candidate collection and are not URL-matched
     * until the citation-level filtering step.
     */
    const categorizedRules = {
        source: [
            { 'url_str': '/articles/', label: 'matching-substring' },
            { 'url_str': '/missing/', label: 'missing-substring' }
        ]
    };
    const urls = ['https://example.test/articles/final'];
    const ruleKeyMap = buildRuleKeyMap(categorizedRules);
    const result = getCandidateRulesForUrlKeys(ruleKeyMap, buildUrlKeySet(urls));

    assert.deepEqual(labelsForCategory(result.categorizedRules, 'source'), [
        'matching-substring',
        'missing-substring'
    ]);
});

test('getRulesForUrlKeys narrows a page rule map down to one citation URL', () => {
    /**
     * The optimized render path collects page-level key candidates, builds a
     * smaller page rule map from those candidates, and then exact-filters rules
     * only against each individual citation URL. This test mirrors that flow.
     */
    const categorizedRules = {
        source: [
            { 'url': 'example.com', label: 'example-domain' },
            { 'url': 'example.com/private', label: 'example-private-path' },
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
    const fullRuleKeyMap = buildRuleKeyMap(categorizedRules);
    const pageCandidates = getCandidateRulesForUrlKeys(fullRuleKeyMap, buildUrlKeySet(pageUrls));
    const pageRuleKeyMap = buildRuleKeyMap(pageCandidates.categorizedRules);

    assert.deepEqual(labelsForCategory(pageCandidates.categorizedRules, 'source'), [
        'example-domain',
        'example-private-path',
        'final-gov',
        'interior-gov',
        'tracked-substring'
    ]);

    const exampleUrls = ['https://example.com/article'];
    const exampleResult = getRulesForUrlKeys(pageRuleKeyMap, buildUrlKeySet(exampleUrls), exampleUrls);
    assert.deepEqual(labelsForCategory(exampleResult.categorizedRules, 'source'), [
        'example-domain'
    ]);

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
