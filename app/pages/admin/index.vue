<script setup lang="ts">
const { setPageTitle } = useMeta();

setPageTitle("Organization");

const organization = {
  id: "swisstopo",
  name: "Bundesamt für Landestopografie",
  name_translations: {
    de: "Bundesamt für Landestopografie",
    fr: "Office fédéral de topographie",
    en: "Federal Office of Topography",
    it: "Ufficio federale di topografia",
    rm: "",
  },
  acronym: "swisstopo",
  acronym_translations: {
    de: "swisstopo",
    fr: "swisstopo",
    en: "swisstopo",
    it: "swisstopo",
    rm: "",
  },
};
</script>

<template>
  <div>
    <UPage>
      <UPageHeader
        :title="$t('Organization')"
        :ui="{
          root: 'p-2',
        }"
      />
      <UPageBody>
        <UAlert
          color="warning"
          title="Heads up!"
          description="This is a placeholder page with dummy data"
        />
        <UPageSection
          :title="organization.name"
          description="View and edit your organization."
          :ui="{ container: 'py-4! gap-4!', description: 'mt-2' }"
        >
          <UForm :disabled="true" class="flex gap-16">
            <div>
              <UFormField label="Name German" name="name_de">
                <UInput
                  v-model="organization.name_translations.de"
                  class="w-100"
                />
              </UFormField>
              <UFormField label="Name French" name="name_fr">
                <UInput
                  v-model="organization.name_translations.fr"
                  class="w-100"
                />
              </UFormField>
              <UFormField label="Name English" name="name_en">
                <UInput
                  v-model="organization.name_translations.en"
                  class="w-100"
                />
              </UFormField>
              <UFormField label="Name Italian" name="name_it">
                <UInput
                  v-model="organization.name_translations.it"
                  class="w-100"
                />
              </UFormField>
              <UFormField label="Name Romansh" name="name_rm">
                <UInput
                  v-model="organization.name_translations.rm"
                  class="w-100"
                />
              </UFormField>
            </div>
            <div>
              <UFormField label="Acronym German" name="acronym_de">
                <UInput v-model="organization.acronym_translations.de" />
              </UFormField>
              <UFormField label="Acronym French" name="acronym_fr">
                <UInput v-model="organization.acronym_translations.fr" />
              </UFormField>
              <UFormField label="Acronym English" name="acronym_en">
                <UInput v-model="organization.acronym_translations.en" />
              </UFormField>
              <UFormField label="Acronym Italian" name="acronym_it">
                <UInput v-model="organization.acronym_translations.it" />
              </UFormField>
              <UFormField label="Acronym Romansh" name="acronym_rm">
                <UInput v-model="organization.acronym_translations.rm" />
              </UFormField>
            </div>
          </UForm>
        </UPageSection>
      </UPageBody>
    </UPage>
  </div>
</template>
