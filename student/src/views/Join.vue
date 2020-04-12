<template>
  <v-container fluid class="fill-height">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="4"
      >
        <v-card>
          <v-card-title>Join Room</v-card-title>
          <v-card-text align="center">
            <v-text-field
              label="Room Code"
              hide-details="true"
              outlined
              class="mb-n3"
            ></v-text-field>
            <v-btn color="primary">Join</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>

  .row {
    max-width: unset !important;
  }

  .v-btn {
    width: 100%;
    height: 3.7em !important;
  }
</style>
<script>
export default {
  name: 'Join',
};
</script>
