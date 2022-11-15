<template>
    <AppModal title="Source des données" :close-btn="true" :submit-btn="false" @modal-hide="routeToBack()" class-name="modal-dialog-scrollable">
        <pre class="bodrer bg-light p-1">{{data}}</pre>
    </AppModal>
</template>

<script>

import AppModal from '@/components/pebble-ui/AppModal.vue';
import { mapState } from 'vuex';

export default {

    components: { AppModal },

    computed: {

        ...mapState(['personnelsDeclarations']),

        /**
         * Retourne les données du personnel depuis le store.
         * 
         * @return {object}
         */
        data() {
            return this.personnelsDeclarations.find(e => e.id == this.$route.params.idPersonnel);
        }
    },

    methods: {
        /**
         * Redirige la navigation vers la vue précédente
         */
        routeToBack() {
            this.$router.push({name:'Validation'});
        }
    }
}

</script>