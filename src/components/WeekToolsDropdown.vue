<template>
    <div class="dropdown">
        <button class="btn btn-dark mx-3 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" v-if="pendingTools"></span>
            Outils
        </button>
        <ul class="dropdown-menu">
            <li>
                <router-link :to="'/week/'+$route.params.id+'/insert'" v-slot="{href, navigate}" custom>
                    <a :href="href" @click="navigate" class="dropdown-item" type="button" >
                        <i class="bi bi-plus me-1" v-if="!pending.exportWeek"></i>
                        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" v-else></span>
                        <span>Créer une période</span>
                    </a> 
                </router-link>
                <router-link :to="'/week/'+$route.params.id+'/export'" v-slot="{href, navigate}" custom>
                    <a :href="href" @click="navigate" class="dropdown-item" type="button" >
                        <i class="bi bi-cloud-download me-1" v-if="!pending.exportWeek"></i>
                        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" v-else></span>
                        <span>Exporter</span>
                    </a> 
                </router-link>

            </li>
        </ul>
    </div>
</template>

<script>

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
}

</script>