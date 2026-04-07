<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";
import type { Organization } from "~/api/organization";
import { useOrganizationApi } from "~/api/organization";
import { useUsersApi, type AccessRequest } from "~/api/users";

const { setPageTitle } = useMeta();
const { formatDateTime } = useDateTimeFormat();
const { toastError, toastSuccess } = useToastHelpers();

const organizations = ref<Organization[]>([]);
const pendingAccessRequest = ref<AccessRequest | null>(null);

setPageTitle($t("accessRequest.pageTitle"));

onMounted(() => {
  useOrganizationApi()
    .getOrganizations()
    .then((orgs) => {
      organizations.value = orgs;
    });
  useUsersApi()
    .pendingAccessRequest()
    .then((request: AccessRequest | null) => {
      pendingAccessRequest.value = request;
    });
});

export type AccessRequestSchema = v.InferOutput<typeof schema>;
const schema = v.object({
  organization_id: v.pipe(
    v.string(() => $t("validation.required")),
    v.nonEmpty(() => $t("validation.required")),
  ),
});

const formState = reactive({
  organization_id: undefined as string | undefined,
});

function handleSubmit(event: FormSubmitEvent<AccessRequestSchema>) {
  console.log("submit", event.data);
  useUsersApi()
    .createAccessRequest(event.data.organization_id)
    .then((request) => {
      pendingAccessRequest.value = request;
      toastSuccess($t("accessRequest.requestSubmitted"));
    })
    .catch(() => {
      toastError($t("accessRequest.requestFailed"));
    });
}

function handleCancelRequest(requestId: string) {
  useUsersApi()
    .cancelAccessRequest(requestId)
    .then(() => {
      pendingAccessRequest.value = null;
      toastSuccess($t("accessRequest.requestCancelled"));
    })
    .catch(() => {
      toastError($t("accessRequest.requestFailed"));
    });
}
</script>

<template>
  <UPage>
    <UPageHeader
      :title="$t('accessRequest.pageTitle')"
      :ui="{
        root: 'p-2',
      }"
    />
    <UPageBody>
      <UPageSection
        v-if="!pendingAccessRequest"
        :ui="{ container: 'py-4! gap-4!' }"
        :title="$t('accessRequest.requestAccessTitle')"
        :description="$t('accessRequest.requestAccessSubtitle')"
      >
        <UPageCard :description="$t('accessRequest.requestAccessDescription')">
          <UForm
            :schema="schema"
            :state="formState"
            @submit="handleSubmit($event)"
          >
            <div class="flex shrink-0 flex-col flex-wrap gap-4 p-6">
              <UFormField
                :label="$t('organization.title')"
                name="organization_id"
              >
                <USelectMenu
                  v-model="formState.organization_id"
                  :search-input="false"
                  class="w-full max-w-200"
                  :items="[
                    ...organizations.map((org) => ({
                      label: org.name,
                      value: org.id,
                    })),
                  ]"
                  value-key="value"
                />
              </UFormField>
            </div>
            <div class="flex shrink-0 justify-end p-6">
              <UButton
                class="m-1"
                type="submit"
                :label="$t('common.submit')"
                color="primary"
              />
            </div>
          </UForm>
        </UPageCard>
      </UPageSection>
      <UPageSection
        v-if="pendingAccessRequest"
        :ui="{ container: 'py-4! gap-4!' }"
        :title="$t('accessRequest.pendingTitle')"
        :description="$t('accessRequest.pendingSubtitle')"
      >
        <UPageCard
          :ui="{ root: 'p-4' }"
          :title="pendingAccessRequest.organization_acronym"
          :description="formatDateTime(pendingAccessRequest.created)"
        >
          {{
            $t("accessRequest.pendingDescription", {
              organization_name: pendingAccessRequest.organization_name,
            })
          }}
          <div class="flex shrink-0 justify-end p-6">
            <UButton
              class="m-1"
              :label="$t('accessRequest.cancelRequest')"
              color="primary"
              @click="handleCancelRequest(pendingAccessRequest.id)"
            />
          </div>
        </UPageCard>
      </UPageSection>
    </UPageBody>
  </UPage>
</template>
