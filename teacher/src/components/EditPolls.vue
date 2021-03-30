<template>
  
    <v-card>
        <v-card-title>
        <span style="font-family: var(--main-font);"
            >Create a new poll</span
        >
        </v-card-title>
        <v-card-text>
        <v-container>
            <v-row>
            <v-col cols="12">
                <v-textarea
                solo
                v-model="prompt"
                name="question"
                label="Question"
                style="font-family: var(--main-font)"
                required
                auto-grow
                rows="2"
                ></v-textarea>
            </v-col>
            <v-slide-y-transition :group="true" style="width: 100%;">
                <v-col
                cols="12"
                v-for="(choice, index) in options"
                v-bind:key="index"
                :style="{ marginTop: index != 0 ? '-40px' : '-30px' }"
                >
                <v-text-field
                    :label="'Choice ' + (index + 1)"
                    required
                    autocomplete="off"
                    :value="choice"
                    v-model="options[index]"
                ></v-text-field>
                </v-col>
            </v-slide-y-transition>
            <v-col cols="12" style="margin-top: -30px;">
                <v-btn @click="options.push('')" small class="mr-1">+</v-btn>
                <v-btn
                @click="removeOption()"
                :disabled="this.options.length == 2"
                small
                >-</v-btn
                >
            </v-col>
            <v-col cols="12" v-if="!useExisting">
            <v-checkbox
              v-model="savePoll"
              style="font-family: var(--main-font); margin-top: -15px;"
              label="Save for future use"
              color="success"
              hide-details
            ></v-checkbox>
            </v-col>
            </v-row>
        </v-container>
        </v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="red"
            text
            @click="$emit('resetPoll'); savePoll = false; prompt='';"
            >{{savedPoll ? 'Clear' : 'Cancel'}}</v-btn
        >
        <v-btn
            text
            @click="$emit('savePoll')"
            >Close</v-btn
        >
        <v-btn color="green lighten-1" text @click="$emit('setOptions', options); $emit('setPrompt', prompt); $emit('createPoll', savePoll); savePoll = false;"
            >Create</v-btn
        >
        </v-card-actions>
    </v-card>

</template>


<script>

export default {
  name: 'EditPolls',

  props: {
   givenPrompt: { type: String, required: true },
   givenOptions: { type: Array, required: true },
   savedPoll: { type: Boolean, required: true },
   useExisting: { type: Boolean, default: false }
  },

  watch: {
    givenPrompt(val) {
        this.prompt = val;
    },
    givenOptions(val) {
        this.options = val;
    }
  },

  data() {
    return {
        prompt: this.givenPrompt,
        options: [...this.givenOptions],
        savePoll: false
    }
  },

  methods: {
    removeOption() {
      if (this.options.length > 2) this.options.pop();
    }
  },
}
</script>

<style scoped>

</style>