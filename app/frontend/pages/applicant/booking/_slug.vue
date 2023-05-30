<template>
  <div>
    <div v-if="loadingApplicant">
      Loading Application...
    </div>
    <div v-else>
      <h1>
        <font-awesome-icon icon="calendar-check" class="mr-2" />
        Booking for Second Interview
      </h1>
      <div class="font-bold">
        Applicant
      </div>
      <div>
        {{ applicant.name }}
      </div>
      <div class="font-bold mt-8">
        Book Your Slot
      </div>
      <p class="mb-4">
        The following slots are available next week. Please select one of the slots and click on "Book" to book your second interview:
      </p>
      <div class="flex space-x-4">
        <div class="w-1/4 p-4 rounded-md bg-gray-200">
          <h3>Monday</h3>
          <ul>
            <li>
              <label>
                <input type="radio" v-model="slot" value="Monday, 09:00" id="calendar-1" />
                09:00
              </label>
            </li>
            <li>
              <label>
                <input type="radio" v-model="slot" value="Monday, 11:30" id="calendar-2" />
                11:30
              </label>
            </li>
            <li>
              <label>
                <input type="radio" v-model="slot" value="Monday, 13:30" id="calendar-3" />
                13:30
              </label>
            </li>
          </ul>
        </div>
        <div class="w-1/4 p-4 rounded-md bg-gray-200">
          <h3>Tuesday</h3>
          <ul>
            <li>
              <label>
                <input type="radio" v-model="slot" value="Tuesday, 14:00" id="calendar-4" />
                14:00
              </label>
            </li>
            <li>
              <label>
                <input type="radio" v-model="slot" value="Tuesday, 15:00" id="calendar-5" />
                15:00
              </label>
            </li>
            <li>
              <label>
                <input type="radio" v-model="slot" value="Tuesday, 16:00" id="calendar-6" />
                16:00
              </label>
            </li>
          </ul>
        </div>
        <div class="w-1/4 p-4 rounded-md bg-gray-200">
          <h3>Thursday</h3>
          <ul>
            <li>
              <label>
                <input type="radio" v-model="slot" value="Thursday, 10:00" id="calendar-4" />
                10:00
              </label>
            </li>
            <li>
              <label>
                <input type="radio" v-model="slot" value="Thursday, 14:00" id="calendar-5" />
                14:00
              </label>
            </li>
            <li>
              <label>
                <input type="radio" v-model="slot" value="Thursday, 15:00" id="calendar-6" />
                15:00
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div class="mb-12">
        <p>
          Please select a slot and click the button below to book your second interview.
        </p>
        <Button color="accent" @clicked="book()">
          <font-awesome-icon icon="check" class="mr-2" />
          Book
        </Button>
      </div>
      <div class="mt-16 mb-4 p-6 bg-red-200 rounded-lg max-w-xl">
        <div class="mb-4">
          In case you are no longer interested in this position, please click the button below to withdraw your application.
        </div>
        <Button color="red-700" size="small" @clicked="widthdraw()">
          <font-awesome-icon icon="times" class="mr-2" />
          Withdraw Application
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Button from '~/components/Button.vue'

export default {
  components: {
    Button
  },
  layout: 'applicant',
  asyncData ({ params }) {
    const slug = params.slug
    return { slug }
  },
  data () {
    return {
      loadingApplicant: true,
      slot: null
    }
  },
  computed: {
    ...mapState(['applicant']),
    hasChosenSlot () {
      return this.slot !== null
    }
  },
  mounted () {
    this.$store.dispatch('fetchApplicant', {
      processInstanceId: this.slug
    }).then(() => {
      this.loadingApplicant = false
    })
  },
  methods: {
    book () {
      if (!this.hasChosenSlot) {
        return
      }
      this.$store.dispatch('bookSecondInterview', {
        processInstanceId: this.slug,
        slot: this.slot
      }).then(() => {
        this.$router.push('/applicant')
      })
    },
    widthdraw () {
      this.$store.dispatch('withdrawApplication', {
        processInstanceId: this.slug
      }).then(() => {
        this.$router.push('/applicant')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  @apply text-2xl pt-4 pb-8;
}

h2 {
  @apply text-lg font-bold pt-4 mb-8;
}

h3 {
  @apply text-base font-bold text-digisailor-accent pb-2;
}
</style>
