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
                      <v-list-item-subtitle><v-chip class="mr-1" v-for="(option, i) in poll.options" :key="index+'-'+i">{{ option }}</v-chip></v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-icon>
                      <v-btn text small @mouseover="hover = true" @mouseleave="hover = false" @click="$emit('removePoll', poll.uid)"><v-icon color="error">mdi-close</v-icon></v-btn>
                    </v-list-item-icon>
  
                  </v-list-item>
                  <v-divider
                    v-if="index + 1 < pastPollsData.length"
                    :key="index+'-divider'"
                  ></v-divider>
                </template>
                </v-slide-y-transition>

                <v-slide-y-transition style="width: 100%;">
                <h1 v-if="!emptySecond && pastPollsData.length == 0" style="font-weight: normal; font-size: 20px;">There are no existing polls to use. Click <v-btn color="success" style="margin-top: -5px;" small>Create new</v-btn> and select <v-chip style="margin-top: 5px;"> <v-checkbox
                  style="font-family: var(--main-font); display: inline-block; margin-top: -5px; "
                  label="Save as existing"
                  color="success"
                  hide-details
                  disabled
                ></v-checkbox></v-chip> to save polls here.</h1>
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
              @click="$emit('cancel'); emptySecond = false;"
              >Cancel</v-btn
          >
          </v-card-actions>
    </v-card>

</template>


<script>

export default {
  name: 'SearchPolls',

  props: {
   pastPollsData: { type: Array, required: true }
  },

  mounted() {
  },

  watch: {
  },

  data() {
    return {
      search: "",
      hover: false,
      emptySecond: false
      /*pastPollsEx: [
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
      ]*/
    }
  },

  methods: {
    clearSearch() {
       this.search="";
    },
    enterPoll(poll) {
      if(!this.hover) this.$emit("pollSelected", poll);
    }
  },

  computed: {
    filteredItems() {
        return this.pastPollsData.filter(poll => {
          if(!this.search) return this.pastPollsData;
          if(poll.prompt.toLowerCase().includes(this.search.toLowerCase())) return true;
          for(let i=0; i<poll.options.length; i++) {
            if(poll.options[i].toLowerCase().includes(this.search.toLowerCase())) return true;
          }
          return false;
        }).sort((a, b) => (a.prompt > b.prompt) ? 1 : -1);
    }
  },

  watch: {
    pastPollsData(val) {
      if(val.length == 0) {
        this.emptySecond = true
      }
    }
  }
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