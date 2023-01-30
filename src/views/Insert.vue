<template>
    <app-modal title="Créer une période"
        id="insert"
        :close-btn="true"
        :submit-btn="true"
        submit-label="Créer"
        close-label='Annuler'
        :pending="pending.insert"
        
        @modal-hide="routeToParent()"
        @submit="createPeriode(newDate)"
        >

        <insert-options
            v-model:structure__personnel_id="structure__personnel_id"
            v-model:newDate="newDate"
            :semaine="semaine"
            />
    </app-modal>
</template>

<script>
import InsertOptions from '../components/InsertOptions.vue'
import AppModal from '../components/pebble-ui/AppModal.vue'
import { mapActions, mapState } from 'vuex';
import { toSqlDate } from '../js/date';

export default {
    data() {
        return {
            structure__personnel_id: null,
            newDate: null,
            semaine: null,
            pending: {
                insert: false
            }
        }
    },

    computed: {
        ...mapState(['personnels', 'personnelsDeclarations', 'semaines'])
    },

    methods: {

        ...mapActions(['refreshPersonnelGtaPeriodes', 'addPersonnel']),

         /**
         * Retourne à la route précédente
         * 
         */
         routeToParent() {
            this.$router.go(-1);
        },

         /**
         * Crée une nouvelle période sur la journée sélectionnée et reroute sur la configuration de la période
         * 
         * @param {Date} newDate
         */
         createPeriode(newDate) {
            this.pending.insert = true;
            let currentPeriodeId;
            this.$app.apiPost('structurePersonnel/POST/'+this.structure__personnel_id+'/createGtaPeriode', {
                date: toSqlDate(newDate)
            }).then((periode) => {
                let personnel = this.personnelsDeclarations.find(e => e.id == this.structure__personnel_id);
                currentPeriodeId = periode.id;
                if (!personnel) {
                    return this.$app.apiGet('structureTempsDeclaration/GET/listDeclarations', {
                        dd: this.semaine.dd,
                        df: this.semaine.df,
                        group_by_personnel: true,
                        structure__personnel_id: this.structure__personnel_id
                    }).then(data => {
                        return this.addPersonnel(data.personnels[0]);
                    });
                } else {
                    periode.structure_temps_declarations = [];
                    periode.gta_declarations = [];
                    return this.refreshPersonnelGtaPeriodes([periode]);
                }
            }).catch(this.$app.catchError)
            .finally(() => {
                this.pending.insert = false;
                this.$router.push(`/week/${this.semaine.year}${this.semaine.week}/periode/${currentPeriodeId}`);
            });
        },

        /**
         * Retourne la valeur de la semaine actuelle
         * 
        */
        getCurrentSemaine() {
            const week = this.$route.params.id.slice(4);
            const year = this.$route.params.id.slice(0,4);
            return this.semaines.find(e => e.year == year && e.week == week);
        }
    },

    components: { InsertOptions, AppModal },

    mounted() {
        this.semaine = this.getCurrentSemaine();
    }
}

</script>