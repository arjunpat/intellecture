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
          <v-card-title>Sign In</v-card-title>
          <v-card-text align="center">
            <div class="mb-4">
            <v-btn color="primary">Sign in with Google</v-btn>
            </div>
            <div>
            <v-btn>Sign in with email/password</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
  .v-btn {
    width: 20em;
  }

  .row {
    max-width: unset !important;
  }
</style>
<script>
export default {
  name: 'Sign In',
};
</script>
