<template>
  <div>
    <div v-if="loadingProcess">
      Loading Application...
    </div>
    <div v-else>
      <h1>
        ✅ Accept Job Offer
      </h1>
      <div class="font-bold">
        Position
      </div>
      <div>
        {{ processInstance.title }}
      </div>
      <div class="mt-8 mb-12">
        <p>
          Please confirm that you accept the job offer.
        </p>
        <Button color="accent" @clicked="acceptJobOffer()">
          <font-awesome-icon icon="check" class="mr-2" />
          Accept Job Offer
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
    acceptJobOffer () {
      this.$store.dispatch('acceptJobOffer', {
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
