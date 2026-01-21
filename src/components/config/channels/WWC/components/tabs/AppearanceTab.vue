<template>
  <div class="appearance-tab">
    <div class="appearance-tab__scroll">
      <section class="appearance-tab__fields">
        <unnnic-input
          v-model="title"
          :type="titleError ? 'error' : 'normal'"
          :label="$t('weniWebChat.config.TitleInput.label')"
          :placeholder="$t('weniWebChat.config.TitleInput.placeholder')"
          :message="titleError || ''"
        />

        <unnnic-input
          v-for="field in displayedFields"
          :key="field.id"
          v-model="fieldValues[field.id]"
          :label="$t(field.labelKey)"
          :placeholder="$t(field.placeholderKey)"
        />

        <unnnic-dropdown v-if="canAddNewField" class="appearance-tab__add-field">
          <template #trigger>
            <unnnic-button
              class="appearance-tab__add-field-button"
              type="secondary"
              size="small"
              iconLeft="add-1"
              :text="$t('weniWebChat.config.add_field')"
            />
          </template>

          <unnnic-dropdown-item
            v-for="field in availableFields"
            :key="field.id"
            :class="[
              'appearance-tab__field-dropdown-item',
              { 'appearance-tab__field-dropdown-item--displayed': isFieldDisplayed(field.id) },
            ]"
            @click="displayField(field.id)"
          >
            {{ $t(field.labelKey) }}
          </unnnic-dropdown-item>
        </unnnic-dropdown>
      </section>

      <section class="appearance-tab__customization">
        <p class="appearance-tab__customization-title">
          {{ $t('weniWebChat.config.customization') }}
        </p>

        <div class="appearance-tab__color-section">
          <unnnic-label :label="$t('weniWebChat.config.main_color')" />
          <color-picker
            ref="colorPickerRef"
            class="appearance-tab__color-picker"
            @colorChange="handleColorChange"
          />
        </div>

        <div class="appearance-tab__upload-section">
          <unnnic-label :label="$t('weniWebChat.config.avatar_image')" />
          <unnnic-upload-area
            v-model="avatarFiles"
            :acceptMultiple="false"
            supportedFormats=".png,.jpg,.jpeg"
            :maximumUploads="1"
            :filesProgress="[avatarUpload.progress.value]"
            :isUploading="avatarUpload.isUploading.value"
            :canImport="true"
            :canDelete="true"
            :maxFileSize="10"
            @fileChange="handleAvatarChange"
          />
        </div>

        <div class="appearance-tab__upload-section">
          <unnnic-label :label="$t('weniWebChat.config.custom_css')" />
          <unnnic-upload-area
            v-model="cssFiles"
            :acceptMultiple="false"
            supportedFormats=".css"
            :maximumUploads="1"
            :filesProgress="[cssUpload.progress.value]"
            :isUploading="cssUpload.isUploading.value"
            :canImport="true"
            :canDelete="true"
            :maxFileSize="2"
            @fileChange="handleCssChange"
          />
        </div>
      </section>
    </div>

    <div class="appearance-tab__buttons">
      <unnnic-button
        type="tertiary"
        size="large"
        :text="$t('general.Cancel')"
        @click="emit('cancel')"
      />
      <unnnic-button
        type="primary"
        size="large"
        :text="$t('apps.config.save_changes')"
        :loading="loading"
        @click="emit('save')"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import ColorPicker from '@/components/ColorPicker/index.vue';
  import { useFileUpload } from '@/composables/useFileUpload';
  import { APPEARANCE_FIELDS } from '../../constants';
  import { dataUrlToFile } from '@/utils/files';

  const { t } = useI18n();

  const props = defineProps({
    initialTitle: { type: String, default: '' },
    initialSubtitle: { type: String, default: '' },
    initialInitPayload: { type: String, default: '' },
    initialTooltipMessage: { type: String, default: '' },
    initialInputTextFieldHint: { type: String, default: '' },
    initialMainColor: { type: String, default: '#009E96' },
    initialAvatarFile: { type: [File, Object], default: null },
    initialAvatarBase64: { type: String, default: null },
    initialCssFile: { type: [File, Object], default: null },
    initialCustomCss: { type: String, default: null },
    loading: { type: Boolean, default: false },
  });

  const emit = defineEmits([
    'update:title',
    'update:subtitle',
    'update:initPayload',
    'update:tooltipMessage',
    'update:inputTextFieldHint',
    'update:mainColor',
    'update:avatarFile',
    'update:avatarBase64',
    'update:cssFile',
    'update:customCss',
    'save',
    'cancel',
  ]);

  // Refs
  const colorPickerRef = ref(null);
  const title = ref(props.initialTitle);
  const displayedFieldIds = ref(new Set());

  // Field values as a reactive object
  const fieldValues = ref({
    subtitle: props.initialSubtitle,
    initPayload: props.initialInitPayload,
    tooltipMessage: props.initialTooltipMessage,
    inputTextFieldHint: props.initialInputTextFieldHint,
  });

  // File uploads
  const avatarUpload = useFileUpload();
  const cssUpload = useFileUpload();
  const avatarFiles = ref([]);
  const cssFiles = ref([]);
  const avatarBase64 = ref(props.initialAvatarBase64);

  // Initialize displayed fields based on initial values
  onMounted(async () => {
    APPEARANCE_FIELDS.forEach((field) => {
      if (fieldValues.value[field.id]?.trim()) {
        displayedFieldIds.value.add(field.id);
      }
    });

    // Initialize avatar file if base64 provided
    if (props.initialAvatarBase64) {
      const file = await dataUrlToFile(props.initialAvatarBase64, 'avatar.png');
      if (file) {
        avatarFiles.value = [file];
      }
    }

    // Initialize CSS file
    if (props.initialCssFile) {
      cssFiles.value = [props.initialCssFile];
    }
  });

  // Computed
  const availableFields = computed(() => APPEARANCE_FIELDS);

  const displayedFields = computed(() =>
    APPEARANCE_FIELDS.filter(
      (field) => displayedFieldIds.value.has(field.id) || fieldValues.value[field.id]?.trim(),
    ),
  );

  const canAddNewField = computed(() => displayedFields.value.length < APPEARANCE_FIELDS.length);

  const titleError = computed(() => {
    if (!title.value?.trim()) {
      return t('errors.empty_input');
    }
    if (title.value.length > 20) {
      return 'By default, the maximum is 20 characters.';
    }
    return '';
  });

  // Methods
  function isFieldDisplayed(fieldId) {
    return displayedFieldIds.value.has(fieldId) || fieldValues.value[fieldId]?.trim();
  }

  function displayField(fieldId) {
    if (!isFieldDisplayed(fieldId)) {
      displayedFieldIds.value.add(fieldId);
    }
  }

  function handleColorChange(color) {
    emit('update:mainColor', color);
  }

  function handleAvatarChange(files) {
    avatarUpload.handleImageUpload(files, async (base64, fileName) => {
      if (!base64) {
        avatarFiles.value = [];
        avatarBase64.value = null;
        emit('update:avatarFile', null);
        emit('update:avatarBase64', null);
        return;
      }

      const file = await avatarUpload.base64ToFile(base64, fileName);
      avatarFiles.value = files;
      avatarBase64.value = base64;
      emit('update:avatarFile', file);
      emit('update:avatarBase64', base64);
    });
  }

  function handleCssChange(files) {
    cssUpload.handleTextUpload(files, (content, file) => {
      if (!content) {
        cssFiles.value = [];
        emit('update:cssFile', null);
        emit('update:customCss', null);
        return;
      }

      cssFiles.value = files;
      emit('update:cssFile', file);
      emit('update:customCss', content);
    });
  }

  // Watchers to emit changes
  watch(title, (value) => emit('update:title', value));
  watch(
    () => fieldValues.value.subtitle,
    (value) => emit('update:subtitle', value),
  );
  watch(
    () => fieldValues.value.initPayload,
    (value) => emit('update:initPayload', value),
  );
  watch(
    () => fieldValues.value.tooltipMessage,
    (value) => emit('update:tooltipMessage', value),
  );
  watch(
    () => fieldValues.value.inputTextFieldHint,
    (value) => emit('update:inputTextFieldHint', value),
  );
</script>

<style lang="scss" scoped>
  .appearance-tab {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__scroll {
      display: flex;
      flex-direction: column;
      overflow: auto;
      scrollbar-gutter: stable;
      padding-bottom: $unnnic-space-6;
      flex: 1;
    }

    &__fields {
      display: flex;
      flex-direction: column;
      gap: $unnnic-space-3;
    }

    &__add-field {
      width: 100%;

      :deep(.unnnic-dropdown__trigger) {
        width: 100%;
      }

      :deep(.unnnic-dropdown__content) {
        top: 0%;
        right: 10%;
      }
    }

    &__add-field-button {
      width: 100%;
    }

    &__field-dropdown-item {
      &--displayed {
        color: $unnnic-color-neutral-cleanest;
        cursor: not-allowed;
      }
    }

    &__customization {
      display: flex;
      flex-direction: column;
      gap: $unnnic-space-4;
    }

    &__customization-title {
      color: $unnnic-color-gray-800;
      font: $unnnic-font-display-3;
      margin: 0;
      margin-top: $unnnic-space-6;
    }

    &__color-section {
      display: flex;
      flex-direction: column;
      gap: $unnnic-space-2;
    }

    &__color-picker {
      cursor: pointer;
    }

    &__upload-section {
      display: flex;
      flex-direction: column;
      gap: $unnnic-space-4;
    }

    &__buttons {
      display: flex;
      gap: $unnnic-space-3;
      justify-content: center;
      padding: $unnnic-space-6 0;
      margin-top: auto;

      :deep(.unnnic-button) {
        width: 100% !important;
      }
    }
  }
</style>
