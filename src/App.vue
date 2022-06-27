<template>

	<AppWrapper
		:cfg="cfg"
		:cfg-menu="cfgMenu"
		:cfg-slots="cfgSlots"
		
		@auth-change="setLocal_user"
		@structure-change="switchStructure">

		<template v-slot:header>
			<div class="mx-2" v-if="selectedWeek">
				Semaine {{$route.params.id}} : <DateInterval :dd="selectedWeek.dd" :df="selectedWeek.df"></DateInterval>
			</div>
		</template>


		<template v-slot:menu>
			<AppMenu>
				<AppMenuItem :href="'/week/'+ currentWeek" look="dark" icon="bi bi-calendar2-check">Validation</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:list>
			<Spinner v-if="pending.semaines"></Spinner>

			<AppMenu v-if="semaines">
				<Spinner v-if="pending.moreWeeks"></Spinner>
				<AppMenuItem id="btnBefore" button-style="btn-secondary" @click="getWeeks('before', '#btnBefore')" v-else>
					<i class="bi bi-chevron-double-up d-block"></i>
					Semaine précédente
				</AppMenuItem>

				<AppMenuItem v-for="semaine in semaines" :key="semaine.week" :href="'/week/'+ semaine.year + semaine.week" >
					<WeekListItem :semaine="semaine"></WeekListItem>
				</AppMenuItem>

				<Spinner v-if="pending.moreWeeks"></Spinner>
				<AppMenuItem id="btnAfter" button-style="btn-secondary" @click="getWeeks('after', '#btnAfter')" v-else>
						Semaine suivante
						<i class="bi bi-chevron-double-down d-block"></i>
				</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:core>
			<div class="bg-light">
				<router-view :cfg="cfg" :semaine="selectedWeek" v-if="isConnectedUser" />
			</div>
		</template>

	</AppWrapper>
	
</template>

<style lang="scss">
	.cursor-pointer {
		cursor : pointer;
	}

	.fs-7 {
		font-size : 0.9rem;
	}

	.fs-8 {
		font-size : 0.8rem;
	}

	.fs-9 {
		font-size: 0.7rem;
	}

	.border-dashed {
        border-bottom : 1px dashed grey;
    }
</style>

<script>

import {weekNumber} from 'weeknumber'

import AppWrapper from '@/components/pebble-ui/AppWrapper.vue'
import AppMenu from '@/components/pebble-ui/AppMenu.vue'
import AppMenuItem from '@/components/pebble-ui/AppMenuItem.vue'
import WeekListItem from '@/components/WeekListItem.vue'
import Spinner from '@/components/pebble-ui/Spinner.vue'

import CONFIG from "@/config.json"
import DateInterval from './components/DateInterval.vue'

export default {

	data() {
		return {
			cfg: CONFIG.cfg,
			cfgMenu: CONFIG.cfgMenu,
			cfgSlots: CONFIG.cfgSlots,
			pending: {
				semaines: true,
				moreWeeks: false
			},
			isConnectedUser: false,

			currentWeek: null,
			interval: [0, 0],
			semaines: null
		}
	},

	computed: {
		/**
		 * Retourne la semaine sélectionnée
		 * @returns {Object}
		 */
		selectedWeek() {
			let week=null;

			if(this.semaines) {
				week = this.semaines.find((e) => `${e.year}${e.week}` == this.currentWeek);
			}

			return week;
		}
	},
	
	watch: {
		'$route'(to) {
			this.currentWeek = to.params.id;
		},
	},	

	methods: {
		/**
		 * Met à jour les informations de l'utilisateur connecté
		 * @param {Object} user Un objet LocalUser
		 */
		setLocal_user(user) {
			if (user) {
				this.$store.dispatch('login', user);
				this.isConnectedUser = true;
			}
			else {
				this.$store.dispatch('logout');
				this.isConnectedUser = false;
			}
		},

		/**
		 * Change de structure, vide le store
		 * 
		 * @param {Integer} structureId
		 */
		switchStructure(structureId) {
			this.$router.push('/');
			this.$store.dispatch('switchStructure', structureId);

		},

		/**
		 * Récupère le numero de semaine de l'année en cours
		 * 
		 * @param {Date} date 
		 */
		getWeekNumber(date){
			return weekNumber(date);
		},

		/**
		 * récupère les semaine avant ou aprés les semaine déja affichées en fonction du paramatre défini 
		 * 
		 * @param {String} side			-before : récupère les semaines avant 
		 * 								-after	: récupère les semaines apres
		 * @param {String} idButton		id de l'élément button 
		 * @param {Number} nb			nombre de semaine ajoutée
		 */
		getWeeks(side, idButton, nb) {
			nb = typeof nb === 'undefined' ? 5 : nb;
			let el = document.querySelector(idButton);
			el.blur();

			let newStartWeek;
			let newEndWeek;
			let direction;
			let appendMode;

			if(side === 'before') {
				newStartWeek = parseInt(this.interval[0])-nb;
				newEndWeek = parseInt(this.interval[0])-1;
				direction = "DESC";
				appendMode = 'unshift';
			} else {
				newStartWeek = parseInt(this.interval[1])+1;
				newEndWeek = parseInt(this.interval[1])+nb;
				direction = "ASC";
				appendMode = 'push';
			}

			this.loadWeeks(newStartWeek, newEndWeek, {
				direction,
				appendMode,
				pending: 'moreWeeks'
			});
		},

		/**
		 * Charge les informations sur une liste de semaine depuis l'API
		 * 
		 * @param {Number} start La semaine de départ au format AAAASS (SS étant le num de semaine)
		 * @param {Number} end La semaine de fin au format AAAASS
		 * @param {Object} options 
		 * - direction					Le sens du trie des semaines (ASC défaut ou DESC)
		 * - pending					La clé du pending à utiliser
		 * - appendMode					Le mode d'insertion dans la collection (unshift, push, replace)
		 * 
		 * @returns {Promise}
		 */
		loadWeeks(start, end, options) {
			start = typeof start === 'undefined' ? this.interval[0] : start;
			end = typeof end === 'undefined' ? this.interval[1] : end;
			options = typeof options === 'undefined' ? {} : options;

			if (!options.direction) { options.direction = 'ASC'; }
			if (!options.pending) { options.pending = 'semaines'; }
			if (!options.appendMode) { options.appendMode = 'replace'; }

			let urlApi = 'gtaPeriode/GET/listWeeksAnalytics?week_start=' + start + '&week_end=' + end + '&order_direction=' + options.direction;

			this.pending[options.pending] = true;

			return this.$app.apiGet(urlApi)
			.then( (data) => {

				if (options.appendMode == 'unshift') {
					for (let index in data) {
						this.semaines.unshift(data[index]);
					}
					this.interval[0] = start;
				}
				else if (options.appendMode == 'push') {
					for (let index in data) {
						this.semaines.push(data[index]);
					}
					this.interval[1] = end;
				}
				else {
					this.semaines = data;
					this.interval[0] = start;
					this.interval[1] = end;
				}
				this.pending[options.pending] = false;
			})
			.catch(this.$app.catchError);
		}
	},

	components: {
		AppWrapper,
		AppMenu,
		AppMenuItem,
		WeekListItem,
		Spinner,
		DateInterval
	},

	mounted() {

		this.$router.push('/');
		
		this.$app.addEventListener('structureChanged', (user) => {
			if(user) {
				let today = new Date();
				let year = today.getFullYear();

				/* Il est nécessaire de développer une fonction pour traiter les changement d'année :
				 * Actuellement, si la currentWeek est 202201, la currentWeek-5 est 202196 ce qui n'est pas possible.
				 * Il faut voir au niveau des fonction natives de JavaScript qui peuvent potentiellement
				 * permettre de faire des calcule de date (ex : +14 jours ou -35 jours)
				 */
				this.currentWeek = parseInt(`${year}${this.getWeekNumber(today)}`);

				let start = this.currentWeek-5;
				let end = (this.currentWeek+2);

				this.loadWeeks(start, end)
				.then(() => {
					this.$router.push('/week/'+this.currentWeek);
				});
			}
		});



	},
}
</script>