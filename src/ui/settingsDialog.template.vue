<cdx-dialog
    v-model:open="open"
    :title="dialogTitle"
    :use-close-button="true"
    :primary-action="primaryAction"
    :default-action="defaultAction"
    @primary="onPrimaryAction"
    @default="onDefaultAction"
    @update:open="onUpdateOpen"
    class="cite-unseen-dialog"
>
    <template #header>
        <div class="cite-unseen-dialog-header">
            <span>{{ dialogTitle }}</span>
            <a href="https://meta.wikimedia.org/wiki/Cite_Unseen" target="_blank" class="cite-unseen-dialog-docs-link">
                {{ $options.i18n.documentationLink }}
            </a>
        </div>
    </template>

    <div class="cite-unseen-target-section">
        <span class="cite-unseen-target-label">
            {{ $options.i18n.viewSettingsFrom }}
            <span v-if="isSaving" class="cite-unseen-loading-text">({{ $options.i18n.loading }})</span>
        </span>
        <div class="cite-unseen-target-controls">
            <label class="cite-unseen-radio-option">
                <input type="radio" v-model="target" value="meta" @change="onTargetChange" :disabled="isSaving">
                <span>{{ $options.i18n.metaWikiGlobal }}</span>
            </label>
            <label class="cite-unseen-radio-option">
                <input type="radio" v-model="target" value="local" @change="onTargetChange" :disabled="isSaving">
                <span>{{ targetWikiDisplayName }} ({{ $options.i18n.local }})</span>
            </label>
        </div>
        <span>
            ({{ $options.i18n.localSettingGuidance }})
        </span>
    </div>

    <hr />

    <cdx-tabs v-if="!isSaving" v-model:active="activeTab">
        <cdx-tab name="general" :label="$options.i18n.tabGeneral">
            <cdx-checkbox v-model="settings.dashboard">
                {{ $options.i18n.showDashboard }}
            </cdx-checkbox>
            <cdx-checkbox v-model="settings.showSuggestions">
                {{ $options.i18n.showSuggestionsButton }}
            </cdx-checkbox>
            <cdx-checkbox v-model="settings.hideSocialMediaReliabilityRatings">
                {{ $options.i18n.hideSocialMediaReliabilityRatings }}
            </cdx-checkbox>
            <cdx-checkbox v-model="settings.showOtherLanguageReliabilityRatings">
                {{ $options.i18n.showOtherLanguageReliabilityRatings }}
            </cdx-checkbox>
            <cdx-checkbox v-model="settings.showUnknownLinksIcon">
                {{ $options.i18n.showUnknownLinksIcon }}
            </cdx-checkbox>
        </cdx-tab>

        <cdx-tab name="categories" :label="$options.i18n.tabCategories">
            <div class="cite-unseen-tab-guidance">
                {{ $options.i18n.categoriesTabGuidance }}
            </div>
            <h3>{{ $options.i18n.enableDisableCategories }}</h3>
            <div v-for="category in categories" :key="category" class="cite-unseen-category-container">
                <cdx-checkbox
                    v-model="settings.categories[category]"
                    :input-value="category"
                >
                    {{ getCategoryDisplayName(category) }}
                </cdx-checkbox>
            </div>
        </cdx-tab>

        <cdx-tab name="ignore" :label="$options.i18n.tabIgnoreDomains">
            <div class="cite-unseen-tab-guidance">
                {{ $options.i18n.ignoreDomainsTabGuidance }}
            </div>
            <h3>{{ $options.i18n.domainsToIgnore }}</h3>
            <div v-for="category in categoriesForDomains" :key="category" class="cite-unseen-domain-category-container">
                <label class="cite-unseen-category-label">{{ getCategoryDisplayName(category) }}</label>
                <cdx-text-area
                    v-model="settings.domainIgnore[category]"
                    :rows="3"
                    @input="onDomainInputChange(category, 'ignore')"
                />
            </div>
        </cdx-tab>

        <cdx-tab name="additionalDomains" :label="$options.i18n.tabAdditionalDomains">
            <div class="cite-unseen-tab-guidance">
                {{ $options.i18n.additionalDomainsTabGuidance }}
            </div>
            <h3>{{ $options.i18n.additionalDomains }}</h3>
            <div v-for="category in categoriesForDomains" :key="category" class="cite-unseen-domain-category-container">
                <label class="cite-unseen-category-label">{{ getCategoryDisplayName(category) }}</label>
                <cdx-text-area
                    v-model="settings.additionalDomains[category]"
                    :rows="2"
                    @input="onDomainInputChange(category, 'additional')"
                />
            </div>
        </cdx-tab>

        <cdx-tab name="additionalStrings" :label="$options.i18n.tabAdditionalStrings">
            <div class="cite-unseen-tab-guidance">
                {{ $options.i18n.additionalStringsTabGuidance }}
            </div>
            <h3>{{ $options.i18n.additionalUrlStrings }}</h3>
            <div v-for="category in categoriesForDomains" :key="category" class="cite-unseen-domain-category-container">
                <label class="cite-unseen-category-label">{{ getCategoryDisplayName(category) }}</label>
                <cdx-text-area
                    v-model="settings.additionalStrings[category]"
                    :rows="2"
                />
            </div>
        </cdx-tab>
    </cdx-tabs>
</cdx-dialog>
