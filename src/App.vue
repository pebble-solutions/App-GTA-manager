<template>

	<AppWrapper
		:cfg="cfg"
		:cfg-menu="cfgMenu"
		:cfg-slots="cfgSlots"
		:sidebar-menu="appMenu"
		
		@auth-change="setLocal_user"
		@config-menu="displayConfig = true">

		<template v-slot:header>
			<div class="mx-2 d-flex align-items-center" v-if="currentWeek">
				<button class="btn btn-dark me-3" type="button" @click.prevent="displayPersonnelFilter = true">
					<i class="bi bi-people-fill me-1" :class="{'text-warning': selectedPersonnels.length}"></i>
					<span v-if="selectedPersonnels.length" class="text-warning">{{selectedPersonnels.length}} sélectionnés</span>
					<span v-else>Tous</span>
				</button>
				<div v-if="selectedWeek">
					Sem. {{getWeekNumber(new Date(selectedWeek.dd))}} : <DateInterval :dd="selectedWeek.dd" :df="selectedWeek.df"></DateInterval>
				</div>

				<week-tools-dropdown />
			</div>
		</template>


		<template v-slot:menu v-if="isConnectedUser">
			<AppMenu>
				<AppMenuItem :href="'/week/'+ currentWeek" look="dark" icon="bi bi-calendar2-check">Validation</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:list v-if="isConnectedUser">

			<div class="bg-light border-bottom border-light sticky-top shadow-sm w-100">
				<div class="p-1 d-flex">
					<div class="pe-1"><Datepicker v-model="searchDate" weekPicker autoApply /></div>
					<button type="button" class="btn btn-outline-secondary" @click.prevent="searchWeek" :disabled="pending.semaines">
						<i class="bi bi-check-lg" v-if="!pending.semaines"></i>
						<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-else></span>
					</button>
				</div>
			</div>

			<Spinner v-if="pending.semaines && isConnectedUser"></Spinner>

			<AppMenu v-if="semaines && !pending.semaines">
				<Spinner v-if="pending.moreWeeks"></Spinner>
				<AppMenuItem id="btnBefore" button-style="btn-light text-primary" @click="getWeeks('before', '#btnBefore')" v-else>
					<i class="bi bi-chevron-double-up d-block"></i>
					Semaines précédentes
				</AppMenuItem>

				<AppMenuItem v-for="semaine in semaines" :key="semaine.week" :href="'/week/'+ semaine.year + semaine.week" >
					<WeekListItem :semaine="semaine"></WeekListItem>
				</AppMenuItem>

				<Spinner v-if="pending.moreWeeks"></Spinner>
				<AppMenuItem id="btnAfter" button-style="btn-light text-primary" @click="getWeeks('after', '#btnAfter')" v-else>
						Semaines suivantes
						<i class="bi bi-chevron-double-down d-block"></i>
				</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:core v-if="isConnectedUser">
			<div class="bg-light">
				<router-view :cfg="cfg" :semaine="selectedWeek" v-if="isConnectedUser" />
			</div>

			<AppModal className="modal-dialog-scrollable" title="Filtrer le personnel" 
				id="personnelFilter"
				:display="displayPersonnelFilter"
				:submitBtn="true" 
				submitLabel="Valider" 
				
				@modal-hide="displayPersonnelFilter = false"
				@submit="updatePersonnelSelection()">
				<PersonnelFilter @selection-change="personnelsIdSelectionChange"></PersonnelFilter>
			</AppModal>

			<AppModal title="Configuration du module"
				id="configModule"
				:display="displayConfig"
				:close-btn="true"
				class-name="modal-dialog-scrollable modal-xl"
				
				@modal-hide="displayConfig = false">
				<Config v-if="!pending.config" />
			</AppModal>
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
import { mapActions, mapState } from 'vuex'
import date from 'date-and-time';

import { ref } from 'vue';

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import AppModal from './components/pebble-ui/AppModal.vue'
import PersonnelFilter from './components/PersonnelFilter.vue'
import Config from './components/config/Config.vue'

import { getWeekFromYW } from './js/week'
import WeekToolsDropdown from './components/WeekToolsDropdown.vue'

export default {

	data() {
		return {
			cfg: CONFIG.cfg,
			cfgMenu: CONFIG.cfgMenu,
			cfgSlots: CONFIG.cfgSlots,
			pending: {
				semaines: true,
				moreWeeks: false,
				personnels: true,
				config: true
			},
			isConnectedUser: false,

			currentWeek: null,
			interval: [0, 0],
			searchDate: null,

			personnelsIdsSelection: [],
			displayPersonnelFilter: false,

			displayConfig: false,
			appMenu: [
				{
					label: 'Déclarations personnel',
					icon: 'bi bi-calendar-week-fill',
					key: 'week',
					href: '/'
				},
				{
					label: 'Export',
					icon: 'bi bi-cloud-download-fill',
					key: 'export',
					href: '/export'
				}
			]
		}
	},

	computed: {

		...mapState(['semaines', 'personnels', 'selectedPersonnels', 'config']),

		/**
		 * Retourne la semaine sélectionnée
		 * @returns {Object}
		 */
		selectedWeek() {
			console.log("Selected Week");
			return getWeekFromYW(this.currentWeek, this.semaines);
		}
	},
	
	watch: {
		'$route' (to) {
			console.log("Watch route");
				this.currentWeek = to.params.id;
		}
	},	

	methods: {
		...mapActions(['resetPeriodeSelection', 'addSemaines', 'refreshSemaines', 'resetSemaines', 'setPersonnelsSelection', 'setConfigGta', 'resetPersonnelSelection']),

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
			console.log("switchStructure");
			this.$router.push('/');

			this.$store.dispatch('switchStructure', structureId);

			if(structureId) {
				this.resetPersonnelSelection();
				this.personnelsIdsSelection = [];
				
				let today = new Date();
				let year = today.getFullYear();

				let currentWeek = parseInt(`${year}${String(this.getWeekNumber(today)).padStart(2, "0")}`);
				this.currentWeek = currentWeek;
				let start = this.weekCalcul(this.currentWeek, 'less', 5);
				let end = this.weekCalcul(this.currentWeek, 'add', 2);


				this.loadWeeks(start, end)
				.then(() => {
					this.$router.push('/week/'+currentWeek);
				});

				this.loadGtaCodages();

				this.loadPersonnels();

				this.loadConfig();
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

			if (this.selectedPersonnels.length) {
				let ids = this.selectedPersonnels.map(e => e.id);
				urlApi += '&structure__personnel_id='+ids.join(',');
			}

			this.pending[options.pending] = true;

			return this.$app.apiGet(urlApi)
			.then( (data) => {
				let optionsSemaines = {
					'semaines': data
				}

				if (options.appendMode == 'unshift') {
					optionsSemaines['action'] = 'addStart';
					this.addSemaines(optionsSemaines);
					this.interval[0] = start;
				}
				else if (options.appendMode == 'push') {
					optionsSemaines['action'] = 'addEnd';
					this.addSemaines(optionsSemaines);
					this.interval[1] = end;
				}
				else {
					if (options.appendMode == 'replace') {
						this.$router.push('/');
						this.resetSemaines();
					}
					// this.semaines = data;
					this.refreshSemaines(data);
					this.interval[0] = start;
					this.interval[1] = end;
				}
				this.pending[options.pending] = false;
			})
			.catch(this.$app.catchError);
		},


		/**
		 * Charge les GtaCodages dans le store
		 */
		loadGtaCodages() {
			this.pending.codage = true;

			this.$app.apiGet('gtaCodage/GET/list')
			.then((data) => {
				this.$store.commit('gta_codages', data);
			})
			.catch(this.$app.catchError)
		},

		/**
		 * Lance une recherche depuis le formulaire de recherche des semaines.
		 */
		searchWeek() {
			console.log("Search Week");
			let year = this.searchDate[0].getFullYear();
			let week = this.getWeekNumber(this.searchDate[0]);

			let currentWeek = parseInt(`${year}${week}`);
				
			let start = this.weekCalcul(currentWeek, 'less', 5);
			let end = this.weekCalcul(currentWeek, 'add', 2);
	
			this.loadWeeks(start, end)
			.then(() => {
				this.$router.push('/week/'+currentWeek);
			})
			.catch(this.$app.catchError);

		},

		/**
		 * Charge la liste du personnel
		 */
		loadPersonnels() {
			this.pending.personnels = true;

			this.$app.apiGet('structurePersonnel/GET/list', {
				archived: null,
				mls_label: 'fonction,secteur'
			})
			.then((data) => {
				this.$store.commit('personnels', data)
			})
			.catch(this.$app.catchError)
			.finally(() => {
				this.pending.personnels = false;
			});
		},

		/**
		 * Modifie la liste du personnel sélectionné avant validation.
		 * 
		 * @param {array} selection Liste des IDS nouvellement sélectionnés
		 */
		personnelsIdSelectionChange(selection) {
			this.personnelsIdsSelection = selection;
		},

		/**
		 * Met à jour la liste du personnel sélectionné au niveau du store.
		 * Génère une collection de personnels depuis la liste d'IDs, puis met à jour
		 * le store.
		 */
		updatePersonnelSelection() {
			let personnels = [];

			this.personnelsIdsSelection.forEach(id => {
				let personnel = this.personnels.find(e => e.id == id);
				if (personnel) {
					personnels.push(personnel);
				}
			});

			this.setPersonnelsSelection(personnels);
			this.displayPersonnelFilter = false;
		},

		/**
		 * Charge la configuration relative à la paie.
		 */
		loadConfig() {
			this.pending.config = true;

			this.$app.apiGet('gtaDeclaration/GET/config')
			.then(data => this.setConfigGta(data)).catch(this.$app.catchError).finally(() => this.pending.config = false);
		}
	},

	components: {
		AppWrapper, AppMenu, AppMenuItem, WeekListItem, Spinner, Datepicker, DateInterval, AppModal, PersonnelFilter, Config,
WeekToolsDropdown
	},

	mounted() {
		console.log("Mounted");
		
		// if (!this.$route.params.id) {
		// 	this.$router.push('/');
		// 	console.log("Go Home")
		// } else {
		// 	this.$router.push(this.$route);
		// 	console.log("Go route")
		// }

		this.$router.push('/');

		this.$app.addEventListener('structureChanged', (structureId) => {
			this.switchStructure(structureId);
			this.searchDate = ref();
		});

	},
}
</script>