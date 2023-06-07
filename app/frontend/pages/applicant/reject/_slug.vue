<template>
  <div>
    <div v-if="loadingProcess">
      Loading Application...
    </div>
    <div v-else>
      <h1>
        ❌ Reject Job Offer
      </h1>
      <div class="font-bold">
        Position
      </div>
      <div>
        {{ processInstance.title }}
      </div>
      <div class="mt-8 mb-12">
        <p>
          Please confirm that you want to reject the job offer.
        </p>
        <Button color="red-800" @clicked="rejectJobOffer()">
          <font-awesome-icon icon="times" class="mr-2" />
          Reject Job Offer
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
      loadingProcess: true,
      slot: null
    }
  },
  computed: {
    ...mapState(['processInstance'])
  },
  mounted () {
    this.$store.commit('RESET_PROCESS_INSTANCE')
    this.loadingProcess = true
    this.$store.dispatch('fetchInstance', {
      processInstanceId: this.slug
    }).then(() => {
      this.loadingProcess = false
    })
  },
  methods: {
    rejectJobOffer () {
      this.$store.dispatch('rejectJobOffer', {
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
