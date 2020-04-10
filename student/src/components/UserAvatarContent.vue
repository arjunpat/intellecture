<!-- TODO: Add skeleton loader to profile pic 
           OR MAYBE: display letter name when profile pic hasn't loaded yet -->
<template>
  <img 
    v-if="user.photoURL"
    :src="user.photoURL"
    :alt="user.displayName"
  >
  <span v-else class="white--text headline">{{ user.displayName[0] }}</span>
</template>

<script>
export default {
  name: 'UserAvatarContent',
  props: {
    user: Object,
  },
}
</script>