<template>
  <div>
    <div class="display-2 font-weight-regular mb-2">{{ lectureInfo.class_name }}</div>
    <div style="border-left-style: solid; border-left-width: 2px; position: relative;" class="ml-2 mb-4">
      <div class="headline ml-2 font-weight-light">{{ lectureInfo.lecture_name }}</div>
      <div class="overline ml-4">{{ lectureStartTime }}</div>
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-avatar v-on="on" style="position: absolute; right: 0; top: 0;">
            <UserAvatarContent :user="lectureInfo.creator"/>
          </v-avatar>
        </template>
        <span>{{ `${lectureInfo.creator.first_name} ${lectureInfo.creator.last_name}` }}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import UserAvatarContent from '@/components/UserAvatarContent'

export default {
  name: 'LectureInfo',
  
  props: {
    lectureInfo: { type: Object, required: true},
  },

  components: {
    UserAvatarContent,
  },

  computed: {
    lectureStartTime() {
      const date = new Date(this.lectureInfo.start_time)
      return date.toLocaleString()
    },
  }
}
</script>