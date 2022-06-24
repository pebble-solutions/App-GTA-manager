<template>

	<AppWrapper
		:cfg="cfg"
		:cfg-menu="cfgMenu"
		:cfg-slots="cfgSlots"
		
		@auth-change="setLocal_user"
		@structure-change="switchStructure">

		<template v-slot:header>
			<div class="mx-2">
				Semaine {{$route.params.id}}
			</div>
		</template>


		<template v-slot:menu>
			<AppMenu>
				<AppMenuItem :href="'/week/'+ actualWeek" look="dark" icon="bi bi-calendar2-check">Validation</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:list>
			<Spinner v-if="pending.semaines"></Spinner>

			<AppMenu v-if="semaines">
				<AppMenuItem id="btnBefore" button-style="btn-outline-primary" @click="getWeek('before', '#btnBefore')">
					<i class="bi bi-chevron-double-up d-block"></i>
					Semaine précédente
				</AppMenuItem>

				<AppMenuItem v-for="semaine in semaines" :key="semaine.week" :href="'/week/'+ semaine.week" >
					<SemaineCardList :semaine="semaine"></SemaineCardList>
				</AppMenuItem>

				<AppMenuItem id="btnAfter" button-style="btn-outline-primary" @click="getWeek('after', '#btnAfter')">
						Semaine suivante
						<i class="bi bi-chevron-double-down d-block"></i>
				</AppMenuItem>
			</AppMenu>
		</template>

		<template v-slot:core>
			<div class="px-2 bg-light">
				<router-view :cfg="cfg" v-if="isConnectedUser" />
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
import SemaineCardList from '@/components/SemaineCardList.vue'
import Spinner from '@/components/pebble-ui/Spinner.vue'

import CONFIG from "@/config.json"

export default {

	data() {
		return {
			cfg: CONFIG.cfg,
			cfgMenu: CONFIG.cfgMenu,
			cfgSlots: CONFIG.cfgSlots,
			pending: {
				semaines: true
			},
			isConnectedUser: false,

			actualWeek: null,
			interval: {
				startWeek:'',
				endWeek: ''
			},
			semaines: null
		}
	},

	watch: {
		'$route'(to) {
			this.actualWeek = to.params.id;
		}
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
		getWeek(side, idButton, nb) {
			nb = typeof nb === 'undefined' ? 5 : nb;
			let el = document.querySelector(idButton);
			el.blur();

			let newStartWeek;
			let newEndWeek;
			let order=null;

			if(side === 'before') {
				newStartWeek = parseInt(this.interval.startWeek)-nb;
				newEndWeek = parseInt(this.interval.startWeek)-1;
				order = "DESC"
			} else {
				newStartWeek = parseInt(this.interval.endWeek)+1;
				newEndWeek = parseInt(this.interval.endWeek)+nb;
			}

			let urlApi = 'gtaPeriode/GET/listWeeksAnalytics?week_start='+newStartWeek+'&week_end='+newEndWeek;
			if(side == 'before') {
				urlApi += '&order_direction='+order;
			}

			this.$app.apiGet(urlApi)
			.then( (data) => {
				for(let index in data) {
					side === 'before' ? this.semaines.unshift(data[index]) : this.semaines.push(data[index]);
				}

				side === 'before' ? this.interval.startWeek = newStartWeek : this.interval.endWeek = newEndWeek;
			})
			.catch(this.$app.catchError);
		},
	},

	components: {
		AppWrapper,
		AppMenu,
		AppMenuItem,
		SemaineCardList,
		Spinner
},

	mounted() {
		let actualDate = new Date();
		let year = actualDate.getFullYear();

		this.$app.addEventListener('structureChanged', (user) => {
			if(user) {
				this.actualWeek = this.getWeekNumber(actualDate);
				this.$router.push("/week/"+ this.actualWeek);


				this.interval.startWeek = year.toString() + (this.actualWeek-5);
				this.interval.endWeek = year.toString() + (this.actualWeek+2);

				let urlApi = 'gtaPeriode/GET/listWeeksAnalytics?week_start=' + this.interval.startWeek + '&week_end=' + this.interval.endWeek;

				this.$app.apiGet(urlApi)
				.then( (data) => {
					this.semaines = data;
					this.pending.semaines = false;
				})
				.catch(this.$app.catchError);
			}
		});



	},
}
</script>