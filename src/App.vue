<template>

	<AppWrapper
		:cfg="cfg"
		:cfg-menu="cfgMenu"
		:cfg-slots="cfgSlots"
		
		@auth-change="setLocal_user">

		<template v-slot:header>
			<div class="mx-2" v-if="selectedWeek">
				Semaine {{getWeekNumber(new Date(selectedWeek.dd))}} : <DateInterval :dd="selectedWeek.dd" :df="selectedWeek.df"></DateInterval>
			</div>
		</template>


		<template v-slot:menu>
			<AppMenu>
				<AppMenuItem :href="'/week/'+ currentWeek" look="dark" icon="bi bi-calendar2-check">Validation</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:list>
			<Spinner v-if="pending.semaines && isConnectedUser"></Spinner>

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
import { mapActions } from 'vuex'
import date from 'date-and-time';

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
		...mapActions(['resetPointage']),

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

			if(structureId) {
				let today = new Date();
				let year = today.getFullYear();

				let currentWeek = parseInt(`${year}${this.getWeekNumber(today)}`);
				this.currentWeek = currentWeek;
				let start = this.weekCalcul(this.currentWeek, 'less', 5);
				let end = this.weekCalcul(this.currentWeek, 'add', 2);

				this.loadWeeks(start, end)
				.then(() => {
					this.$router.push('/week/'+currentWeek);
				});
			}
		},

		/**
		 * Ajout ou enleve des semaines a la currentWeek en fonction de l'année.
		 * 
		 * @param {String} week		le numero de semaine
		 * @param {String} action 	action a réaliser sur la currentWeek
		 *  - add 	ajout des semaines
		 *  - less	enleve des semaines
		 * @param {Number} nb		le nb de semaine a ajouter ou enlever
		 * 
		 * @return {String} 		return la nouvelle currentWeek 
		 */
		weekCalcul(yearWeek, action, nb) {
			let year = yearWeek.toString().slice(0,4);
			let week = yearWeek.toString().slice(4,6);

			let isLeap = date.isLeapYear(parseInt(year));
			let leapYear = isLeap ? 53 : 52;

			let newWeek;

			if (action === "add") {
				newWeek = parseInt(week) + nb;

				if((leapYear == 53 && newWeek > leapYear) || (leapYear == 52 && newWeek > leapYear)) {
					newWeek = newWeek - leapYear;
					// newWeek -= leapYear ??? same ???;
					year = parseInt(year) + 1;
				} 
			} else {
				newWeek = parseInt(week) - nb;

				if(newWeek < 0) {
					newWeek = leapYear + newWeek;
					year = parseInt(year) - 1;
				}
			}

			return `${year}${newWeek.toString().length === 1 ? "0" + newWeek : newWeek}`;
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
				newStartWeek = this.weekCalcul(this.interval[0], "less", nb);
				newEndWeek = this.weekCalcul(this.interval[0], "less", 1);
				direction = "DESC";
				appendMode = 'unshift';
			} else {
				newStartWeek = this.weekCalcul(this.interval[1], "add", 1);
				newEndWeek = this.weekCalcul(this.interval[1], "add", nb);
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

		this.$app.addEventListener('structureChanged', (structureId) => {
			this.switchStructure(structureId);
		});



	},
}
</script>