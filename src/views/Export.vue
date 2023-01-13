<template>
    <app-modal title="Exporter"
        id="export"
        :close-btn="true"
        :submit-btn="true"
        submit-label="Exporter"
        :pending="pending.export"
        
        @modal-hide="routeToHome()"
        @submit="doExport()"
        >

        <export-options
            v-model:dd="exportQuery.dd"
            v-model:df="exportQuery.df"
            v-model:type="exportQuery.type"
            v-model:structure__personnel_id="exportQuery.structure__personnel_id"
            />
    </app-modal>
</template>

<script>
import ExportOptions from '../components/ExportOptions.vue'
import AppModal from '../components/pebble-ui/AppModal.vue'
import FileDownload from 'js-file-download'

export default {
    data() {
        return {
            exportQuery: {
                dd: null,
                df: null,
                type: 'group',
                structure__personnel_id: null
            },
            pending: {
                export: false
            }
        }
    },

    methods: {
        /**
         * Retourne à l'accueil
         */
        routeToHome() {
            this.$router.push('/')
        },

        /**
         * Lance une commande d'export auprès de l'API
         */
        doExport() {
            this.pending.export = true;

			this.$app.apiGet('gtaPeriode/GET/exportCounters.csv', this.exportQuery, {
				responseType: 'blob'
			}).then(data => {
				FileDownload(data, "counters_"+this.exportQuery.dd+"_"+this.exportQuery.df+".csv");
			}).catch(this.$app.catchError).finally(() => this.pending.export = false);
        }
    },

    components: { ExportOptions, AppModal },
}

</script>