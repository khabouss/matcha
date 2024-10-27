<template>
    <NuxtLayout>
        <div style="height: 100%; width: 100%; padding-bottom: 50px;">
            <profile-card v-if="!notFound" :profile="profile" />
            <PageNotFound v-else/>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>
const profile = ref({});
const route = useRoute();
const notFound = ref(false);

const {data, error} = await useCFetch(`http://backend:3001/profile/${route.params.username}`, { method: 'GET' });

if (data.value?.status === 'success') {
  profile.value = data?.value?.data.profile;
}

if (data.value?.status === 'error' || error.value?.statusCode === 400) {
    notFound.value = true;
}

</script>