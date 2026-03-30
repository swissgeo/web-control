<script setup lang="ts">
import { useOrganizationApi, type Organization } from "~/api/organization";

const { toastError } = useToastHelpers();
const { setPageTitle } = useMeta();

setPageTitle($t("organization.title"));

const organization = ref<Organization | null>(null);
const loadingOrganization = ref(false);

onMounted(() => {
  loadOrganization();
});

async function loadOrganization() {
  try {
    loadingOrganization.value = true;
    organization.value = await useOrganizationApi().getOrganization();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    organization.value = null;
    toastError($t("common.loadError"));
  } finally {
    loadingOrganization.value = false;
  }
}
</script>

<template>
  <div>
    <UPage>
      <UPageHeader
        :title="$t('organization.title')"
        :ui="{
          root: 'p-2',
        }"
      />
      <UPageBody>
        <UProgress v-if="loadingOrganization" animation="swing" />
        <UPageSection
          v-if="organization"
          :title="organization.name"
          :description="$t('organization.description')"
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
