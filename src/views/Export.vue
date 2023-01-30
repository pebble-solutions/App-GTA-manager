<template>
    <app-modal :title="titleModal"
        id="export"
        :close-btn="true"
        :submit-btn="true"
        submit-label="Exporter"
        :pending="pending.export"
        
        @modal-hide="routeToParent()"
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
         * retourne à la route précédente
         * 
         */
         routeToParent() {
            this.$router.go(-1);
        },

        /**
         * Lance une commande d'export auprès de l'API
         */
        doExport() {
            this.pending.export = true;

            let fileName = "counters_";
            if (this.exportQuery.structure__personnel_id) {
                fileName += this.exportQuery.structure__personnel_id+"_";
            }
            fileName += this.exportQuery.dd+"_"+this.exportQuery.df+".csv";
    
            this.$app.apiGet('gtaPeriode/GET/exportCounters.csv', this.exportQuery, {
                responseType: 'blob'
            }).then(data => {
                FileDownload(data, fileName);
            }).catch(this.$app.catchError).finally(() => this.pending.export = false, this.routeToParent());
        }
    },

    components: { ExportOptions, AppModal },
    computed:{
        titleModal(){
            if(this.$route.path == '/export'){
                return 'Exporter'
            }else{
                return 'Exporter semaine '+ this.$route.params.id.slice(4)+' (' + this.$route.params.id.slice(0,4) +')'
            }
        }
    }
}

</script>