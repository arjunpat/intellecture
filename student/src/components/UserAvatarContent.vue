<!-- TODO: Add skeleton loader to profile pic 
           OR MAYBE: display letter name when profile pic hasn't loaded yet -->
<template>
  <img 
    v-if="user.photo"
    :src="user.photo"
    :alt="user.first_name"
  >
  <span v-else class="white--text headline">{{ user.first_name[0] }}</span>
</template>

<script>
export default {
  name: 'UserAvatarContent',
  props: {
    user: Object,
  },
}
</script>