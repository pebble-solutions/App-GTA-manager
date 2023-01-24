<template>
    <div class="dropdown">
        <button class="btn btn-dark mx-3 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" v-if="pendingTools"></span>
            Outils
        </button>
        <ul class="dropdown-menu">
            <li>
                <button class="dropdown-item" type="button" @click.prevent="exportWeek()">
                    <i class="bi bi-cloud-download-fill me-1" v-if="!pending.exportWeek"></i>
                    <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" v-else></span>
                    <span>Exporter</span>
                </button>
            </li>
        </ul>
    </div>
</template>

<script>

import FileDownload from 'js-file-download';
import { getWeekFromYW } from '../js/week';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            pending: {
                exportWeek: false
            }
        }
    },

    computed: {
        ...mapState(['semaines']),

        /**
		 * Détecte si un des outils est en cours de requête.
		 * 
		 * @return {Boolean}
		 */
		pendingTools() {
			let tools = ['exportWeek'];
			for (const tool in tools) {
				if (this.pending[tool]) return true;
			}
			return false;
		},

        /**
         * Retourne les informations de la semaine sélectionnée
         * 
         * @return {object}
         */
        selectedWeek() {
            return getWeekFromYW(this.$route.params.id, this.semaines)
        }
    },

    methods: {
        /**
		 * Lance l'export des données de la semaine ouverte
		 */
		exportWeek() {
			this.pending.exportWeek = true;

			this.$app.apiGet('gtaPeriode/GET/exportCounters.csv', {
                dd: this.selectedWeek.dd,
                df: this.selectedWeek.df
            }, {
				responseType: 'blob'
			}).then(data => {
				FileDownload(data, "counters_"+this.selectedWeek.dd+"_"+this.selectedWeek.df+".csv");
			}).catch(this.$app.catchError).finally(() => this.pending.exportWeek = false);
		}
    }
}

</script>