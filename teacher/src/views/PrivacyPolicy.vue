<template>
  <iframe :src="src" width="100%" height="100%"></iframe>
</template>

<script>
  export default {
    name: 'PrivacyPolicy',

    data() {
      return {
        src: 'https://drive.google.com/file/d/125XXyn-Vk978m-cpqxQVr0HFhkuWmUZZ/preview'
      }
    }
  }
</script>