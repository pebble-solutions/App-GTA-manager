<template>
    <app-modal title="Commentaires"
        id="ChatSummary"
        :close-btn="true"
        :submit-btn="false"
        size="lg"
        
        @modal-hide="routeToParent()"
        @submit="routeToParent()"
        >

        <Comments
            :periode="gta_periode"
            v-if="gta_periode"
            />
        
        <AlertMessage variant="warning" v-else>
            La période demandée n'a pas été trouvée.
        </AlertMessage>

    </app-modal>
</template>

<script>

import { mapState } from 'vuex';
import Comments from '../components/comment/Comments.vue'
import AlertMessage from '../components/pebble-ui/AlertMessage.vue'
import AppModal from '../components/pebble-ui/AppModal.vue'

export default {

    computed: {

        ...mapState(["personnelsDeclarations"]),

        /**
         * @return {number}
         */
        periodeId() {
            return parseInt(this.$route.params.idPeriode);
        },

        /**
         * Retourne les informations de période sélectionnée
         * 
         * @return {object}
         */
        gta_periode() {
            let periode;
            for (let i=0; i<this.personnelsDeclarations.length; i++) {
                periode = this.personnelsDeclarations[i].gta_periodes.find(e => e.id == this.periodeId);
                if (periode) break;
            }
            return periode;
        }
    },

    methods: {
        
         /**
         * Retourne à la route précédente
         * 
         */
         routeToParent() {
            this.$router.go(-1);
        }
    },

    components: { Comments, AppModal, AlertMessage },
}

</script>