<cdx-dialog
    v-model:open="open"
    :title="$options.i18n.dialogTitle"
    :use-close-button="true"
    :primary-action="primaryAction"
    :default-action="defaultAction"
    @primary="onPrimaryAction"
    @default="onDefaultAction"
    @update:open="onUpdateOpen"
    class="cite-unseen-dialog"
>
    <div class="cite-unseen-tab-guidance">
        {{ $options.i18n.guidance }}
    </div>

    <div class="cite-unseen-form-section">
        <label class="cite-unseen-input-label">{{ $options.i18n.sourceUrl }}</label>
        <cdx-text-input
            v-model="sourceUrl"
            :disabled="true"
            class="cite-unseen-full-width-input"
        />
    </div>

    <div class="cite-unseen-form-section">
        <label class="cite-unseen-checkbox-label">{{ $options.i18n.suggestedCategories }}</label>
        <div class="cite-unseen-category-grid">
            <cdx-checkbox
                v-for="category in availableCategories"
                :key="category.id"
                v-model="selectedCategories"
                :input-value="category.id"
            >
                {{ category.label }}
            </cdx-checkbox>
        </div>
    </div>

    <div class="cite-unseen-form-section">
        <label class="cite-unseen-input-label">{{ $options.i18n.optionalComment }}</label>
        <cdx-text-area
            v-model="comment"
            :rows="4"
            :placeholder="$options.i18n.commentPlaceholder"
        />
    </div>

    <div class="cite-unseen-tab-guidance">
        {{ $options.i18n.reliabilityGuidance }}
    </div>

    <div class="cite-unseen-form-section">
        <label class="cite-unseen-checkbox-label">{{ $options.i18n.reliabilityProjects }}</label>
        <ul>
            <li v-for="project in reliabilityProjects" :key="project.page">
                <a :href="project.url" target="_blank">{{ project.page }}</a>
            </li>
        </ul>
    </div>
</cdx-dialog>
