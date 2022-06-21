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
			<AppMenu>
				<AppMenuItem id="btnBefore" button-style="btn-outline-primary" @click="getWeek('before', '#btnBefore')">
					<i class="bi bi-chevron-double-up d-block"></i>
					Semaine précédente
				</AppMenuItem>

				<AppMenuItem v-for="semaine in nbSemaine" :key="semaine" :href="'/week/'+ semaine" >
					<SemaineCardList :nbSemaine="semaine"></SemaineCardList>
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

import AppWrapper from '@/components/pebble-ui/AppWrapper.vue'
import AppMenu from '@/components/pebble-ui/AppMenu.vue'
import AppMenuItem from '@/components/pebble-ui/AppMenuItem.vue'
import SemaineCardList from '@/components/SemaineCardList.vue'

import CONFIG from "@/config.json"

export default {

	data() {
		return {
			cfg: CONFIG.cfg,
			cfgMenu: CONFIG.cfgMenu,
			cfgSlots: CONFIG.cfgSlots,
			pending: {
				elements: true
			},
			isConnectedUser: false,

			nbSemaine: null,
			actualWeek: null,
			born: {
				startWeek:null,
				endWeek: null
			}
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

		/***
		 *For know if the actual year is bixestille 
		 */
		bixestilleYear() {
			let actualDate = new Date();
			let year = actualDate.getFullYear();

			let divYearBy4 = year/4;
			let arrDivYearBy4 = divYearBy4.toString().split('.');

			if(arrDivYearBy4.length > 1) {
				return false;
			} else {
				let divBy100 = arrDivYearBy4/100;
				let arrDivBy100 = divBy100.toString.split('.');

				if(arrDivBy100.length > 1) {
					return true;
				} else {
					let divBy400 = arrDivBy100/400;
					let arrDivBy400 = divBy400.toString().split('.');

					if(arrDivBy400.length > 1) {
						return false;
					} else {
						return true
					}
				}
			}
		},

		/**
		 * Récupère le numero de semaine de l'année en cours
		 * 
		 * @param {Date} actualDate 
		 */
		getWeekNumber(actualDate){
			let year = actualDate.getFullYear();
			let oneJan = new Date(year, 0, 1);
			let numberDay = Math.floor((actualDate - oneJan) / (24 * 60 * 60 * 1000));

			return Math.ceil((actualDate.getDay() + 1 + numberDay) / 7);
		},

		/**
		 * récupère les semaine avant ou aprés les semaine déja affichées en fonction du paramatre défini 
		 * 
		 * @param {String} side		-before : récupère les semaines avant 
		 * 							-after	: récupère les semaines apres
		 */
		getWeek(side, idString) {
			console.log(side, idString);

			let el = document.querySelector(idString);
			el.blur();
			return;
		}
	},

	components: {
		AppWrapper,
		AppMenu,
		AppMenuItem,
		SemaineCardList
	},

	mounted() {
		let bixestille = this.bixestilleYear();

		if(bixestille) {
			this.nbSemaine = 53;
		} else {
			this.nbSemaine = 52;
		}

		this.$app.addEventListener('structureChanged', (user) => {
			if(user) {
				this.actualWeek = this.getWeekNumber(new Date());
				this.$router.push("/week/"+ this.actualWeek);
			}
		});

		this.born.startWeek = this.actualWeek - 5;
		this.born.endWeek = this.actualWeek + 2;


	},
}
</script>