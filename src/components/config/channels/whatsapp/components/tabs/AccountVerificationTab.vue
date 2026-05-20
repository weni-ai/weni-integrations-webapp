<template>
  <section class="account-verification">
    <unnnic-disclaimer
      type="attention"
      :title="$t('WhatsApp.config.account_verification.disclaimer.title')"
      :description="$t('WhatsApp.config.account_verification.disclaimer.description')"
    />

    <unnnic-disclaimer
      type="neutral"
      :title="$t('WhatsApp.config.account_verification.disclaimer_reviewing.title')"
      :description="$t('WhatsApp.config.account_verification.disclaimer_reviewing.description')"
    />

    <unnnic-disclaimer
      type="success"
      :title="$t('WhatsApp.config.account_verification.disclaimer_verified.title')"
      :description="$t('WhatsApp.config.account_verification.disclaimer_verified.description')"
    />

    <unnnic-disclaimer
      type="error"
      :title="$t('WhatsApp.config.account_verification.disclaimer_limit_reached.title')"
      :description="$t('WhatsApp.config.account_verification.disclaimer_limit_reached.description')"
    />

    <h3>Confirm that you verified:</h3>

    <section class="checkboxes">
      <unnnic-checkbox label="The company is a legal entity" :modelValue="false" />
      <unnnic-checkbox label="The account owner is a company representative" :modelValue="false" />
      <unnnic-checkbox label="The company is in compliance with the WhatsApp Business Policy" :modelValue="false" />
    </section>

    <h3 class="mt-6">Upload supporting documents</h3>

    <section class="upload-documents">
      Add the documents used to verify the company, with the name “Account name” visible.

      <unnnic-button iconLeft="add" type="secondary" size="large">
        Upload files
      </unnnic-button>

      <unnnic-disclaimer
        type="informational"
        :title="'Suggested documents for Brazil include:'"
      >
        <template #description>
          <ul>
            <li>Company registration document or license (e.g., CNPJ);</li>
            <li>Articles of association or social contract (e.g., MEI);</li>
            <li>Tax document, utility bill, or company bank statement;</li>
          </ul>
        </template>
      </unnnic-disclaimer>

      <a href="https://www.facebook.com/business/help/2058515294227817?id=180505742745347" target="_blank">
        View documentation best practices
      </a>
    </section>

    <footer>
      <unnnic-button type="secondary" size="large">
        Cancel
      </unnnic-button>

      <unnnic-button type="primary" size="large" disabled>
          Send
      </unnnic-button>
    </footer>
  </section>
</template>

<script>
  export default {
    name: 'AccountVerificationTab',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
  };
</script>

<style lang="scss" scoped>
  .account-verification {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  h3 {
    font: $unnnic-font-display-3;
    line-height: 1.5;
    margin: 0;
    margin-bottom: $unnnic-space-4;
    color: $unnnic-color-fg-base;
    font-weight: $unnnic-font-weight-semibold;
  }

  .checkboxes {
    display: flex;
    flex-direction: column;
    gap: $unnnic-space-4;
  }

  .mt-6 {
    margin-top: $unnnic-space-6;
  }

  .upload-documents {
    display: flex;
    flex-direction: column;
    gap: $unnnic-space-2;
  }

  a {
    font: $unnnic-font-body;
    color: $unnnic-color-fg-base;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $unnnic-space-2;
  }
</style>
