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
            v-model:zero_val="exportQuery.zero_val"
            v-model:generate_undefined_code="exportQuery.generate_undefined_code"
            v-model:undefined_prefix="exportQuery.undefined_prefix"
            v-model:decimal_separator="exportQuery.decimal_separator"
            />
    </app-modal>
</template>

<script>
import ExportOptions from '../components/tools/ExportOptions.vue'
import AppModal from '../components/pebble-ui/AppModal.vue'
import FileDownload from 'js-file-download'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            exportQuery: {
                dd: null,
                df: null,
                type: 'group',
                structure__personnel_id: null,
                zero_val: false,
                generate_undefined_code: true,
                undefined_prefix: 'CODE',
                decimal_separator: '.'
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
            }).catch(this.$app.catchError).finally(() => {
                this.pending.export = false;
                this.routeToParent();
            });
        },

        /**
         * Prépare la requête initiales avec les valeurs connues dans l'URL
         */
        initValues() {
            const route = this.$route.matched.find(e => e.path == '/week/:id');

            if (route) {
                this.initDates();
            }

            if (this.$route.params.idPersonnel) {
                this.initPersonnel();
            }
        },

        /**
         * Initialise les dates par rapport aux informations de l'URL
         */
        initDates() {
            let weekId = this.$route.params.id;
            let semaine = this.semaines.find(e => e.year+e.week == weekId);
            if (semaine) {
                this.exportQuery.dd = semaine.dd;
                this.exportQuery.df = semaine.df;
            }
        },

        /**
         * Initialise le personnel ID par rapport aux informations le l'URL
         */
        initPersonnel() {
            let id = this.$route.params.idPersonnel;
            if (id) {
                this.exportQuery.structure__personnel_id = parseInt(id);
            }
        }
    },

    components: { ExportOptions, AppModal },

    computed: {
        ...mapState(['semaines']),

        /**
         * Retourne le titre de la boite modal d'export.
         * 
         * @return {string}
         */
        titleModal() {
            if (this.$route.path == '/export') {
                return 'Exporter';
            } else {
                return 'Exporter semaine '+ this.$route.params.id.slice(4)+' (' + this.$route.params.id.slice(0,4) +')';
            }
        }
    },

    beforeMount() {
        this.initValues();
    }
}

</script>