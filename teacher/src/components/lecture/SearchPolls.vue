<template>
  
    <v-card>
        <v-card-text >
        <v-container>
            <v-row>
            <v-col cols="12">
              <v-text-field class="" style="font-family: var(--main-font)" flat label="Search" prepend-inner-icon="search" solo-inverted v-model="search" clearable @click:clear="clearSearch" autocomplete="off"></v-text-field>
              <v-list two-line id="listcontainer" class="scrollable">
                
                <v-slide-y-transition :group="true" style="width: 100%;">
                <template v-for="(poll, index) in filteredItems">
                  <v-list-item
                    :key="poll.uid"
                    ripple
                    @click="enterPoll(poll)"
                    style="font-family: var(--main-font)" 
                  >
                    <v-list-item-content>
                      <v-list-item-title class="mb-2">{{ poll.prompt }}</v-list-item-title>
                      <v-list-item-subtitle><v-chip class="mr-1" v-for="(option, i) in poll.options" :key="i">{{ option }}</v-chip></v-list-item-subtitle>
                    </v-list-item-content>
  
                  </v-list-item>
                  <v-divider
                    v-if="index + 1 < pastPollsEx.length"
                    :key="index"
                  ></v-divider>
                </template>
                </v-slide-y-transition>

              </v-list>

            </v-col>
            
            </v-row>
        </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="red"
              text
              @click="$emit('cancel')"
              >Cancel</v-btn
          >
          <v-btn color="green lighten-1" text
              >Continue</v-btn
          >
          </v-card-actions>
    </v-card>

</template>


<script>
export default {
  name: 'SearchPolls',

  props: {
   pastPolls: { type: Array, required: true }
  },

  watch: {
  },

  data() {
    return {
      search: "",
      pastPollsEx: [
        {
          uid: 'aweiifojaw93a3f23f',
          prompt: 'Why is the sky blue?',
          options: ['China', 'Coronavirus', 'Hitler', 'My left toe']
        },
        {
          uid: 'aweiifojwefweaw93a3f23f',
          prompt: 'What is your favorite color?',
          options: ['Red', 'Your blood', 'your mom\'s eyes', 'Your right toe']
        },
        {
          uid: 'aweiifojaw9awef3a3f23f',
          prompt: 'When is your birthday?',
          options: ['Your mom', 'Your dad', 'Your sister', 'Obama']
        },{
          uid: 'aweiifojaw93a3ewef23f',
          prompt: 'Why is the sky blue?',
          options: ['China', 'Coronavirus', 'Hitler', 'My left toe']
        },
        {
          uid: 'aweiifojwefwe324aw93a3f23f',
          prompt: 'What is your favorite color?',
          options: ['Red', 'Your blood', 'your mom\'s eyes', 'Your right toe']
        },
        {
          uid: 'aweiifojaw9a2fwef3a3f23f',
          prompt: 'When is your birthday?',
          options: ['Your mom', 'Your dad', 'Your sister', 'Obama']
        },
        {
          uid: 'aweiifojawa93a3f23f',
          prompt: 'Why is the sky blue?',
          options: ['China', 'Coronavirus', 'Hitler', 'My left toe']
        },
        {
          uid: 'aweiifojwefweaw93a43f23f',
          prompt: 'What is your favorite color?',
          options: ['Pineapple', 'Your blood', 'your mom\'s eyes', 'Your right toe']
        },
        {
          uid: 'aweiifojaw49awef3a3f23f',
          prompt: 'When is your birthday?',
          options: ['Your mom', 'Your dad', 'Your sister', 'Obama']
        },
      ]
    }
  },

  methods: {
    clearSearch() {
       this.search="";
    },
    enterPoll(poll) {
      this.$emit("pollSelected", poll);
    }
  },

  computed: {
    filteredItems() {
        return this.pastPollsEx.filter(poll => {
          if(!this.search) return this.pastPollsEx;
          if(poll.prompt.toLowerCase().includes(this.search.toLowerCase())) return true;
          for(let i=0; i<poll.options.length; i++) {
            if(poll.options[i].toLowerCase().includes(this.search.toLowerCase())) return true;
          }
          return false;
        }).sort((a, b) => (a.prompt > b.prompt) ? 1 : -1);
    }
  },
}
</script>

<style scoped>

#listcontainer {
  transition: all 0.3s;
  height: 500px;
}

.scrollable {
  overflow-y: scroll;
  overflow-x: hidden;
}

</style>