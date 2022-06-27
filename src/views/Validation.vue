<template>
    <Spinner v-if="pending.week" label="Chargement des données..."></Spinner>
    <div class="table-responsive" v-else>
        <table class="table table-bordered table-sm fs-7">
            <thead class="align-middle text-center table-secondary">
                <tr>
                    <th>Personnel</th>
                    <th></th>

                    <th class="col-day" v-for="day in weekDays" :key="'day-header-'+day.getDate()">
                        <div>{{day.toLocaleDateString('fr-FR', {weekday: 'long'})}}</div>
                        <div>{{dateToDayMonth(day)}}</div>
                    </th>

                    <th class="col-day">
                        <div>S{{semaine.week}}</div>
                    </th>
                </tr>
            </thead>

            <tbody v-for="personnel in personnels_declarations" :key="'personnel-'+personnel.id" class="table-group-divider"> <!-- composant du personnel -->
                <tr class="text-center">
                    <td rowspan="6" class="text-center">
                        <UserImage :name="personnel.cache_nom" size="user-image-lg" class-name="my-1"></UserImage>
                        <div>{{personnel.cache_nom}}</div>
                    </td>

                    <td class="text-start">
                        Total heures
                    </td>

                    <td v-for="day in week" :key="'th-'+day"></td>
                </tr>

                <!-- À guillaume : en chantier -->
                <!-- <tr v-for="compteur in getCompteurs(personnel)" :key="'personnel-compteur-'+personnel.id+'-'+compteur.key">
                    <td class="text-start">{{compteur.label}}</td>
                    <td v-for="day in weekDays" :key="'personnel-compteur-'+personnel.id+'-'+compteur.key+'-'+day.getDate()">
                        {{compteur.values[day.getDate()]}}
                    </td>
                </tr> -->

                <tr>
                    <td></td>

                    <td class="col-day" v-for="day in weekDays" :key="'personnel-'+personnel.id+'-'+day.getDate()">
                        <template v-for="periode in getPeriodesFromDate(personnel.gta_periodes, day)">
                            <PointageCard @selected-pointage="selectedPointage()" v-for="std in periode.structure_temps_declarations" :key="'declaration-'+periode.id+'-'+std.id"></PointageCard>
                        </template>
                    </td>

                    <td class="col-day"></td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-if="selectedPointages.length > 0" class="p-3 fixed-bottom bg-light shadow border-top">
        <button type="submit" @click.prevent="validatePointage()" class="btn btn-primary col-6" :disabled="!formReady || pending.validate">
            <span v-if="pending.validate">En cours...</span>
            <span v-else>Valider</span>
        </button>

        <button type ="submit" @click.prevent="rejectPointage()" class="btn btn-primary col-6" :disabled="!formReady || pending.validate">
            <span v-if="pending.validate">En cours...</span>
            <span v-else>Rejeter</span>
        </button>
    </div>

    <router-view ></router-view>
</template>

<style lang="scss">
    .vertical-slides-enter-active,
    .vertical-slides-leave-active {
        transition: height .5s ease-in-out;
    }

    .vertical-slides-enter-from,
    .vertical-slides-leave-to {
        height: 0;
    }

    .col-day {
        max-width: 150px;
        min-width: 150px;
        width: 150px;
    }

</style>

<script>
import PointageCard from '@/components/PointageCard.vue';
import UserImage from '@/components/pebble-ui/UserImage.vue';
import Spinner from '../components/pebble-ui/Spinner.vue';

export default {
    inheritAttrs: false,

    props: {
        semaine: Object
    },

    data() {
        return {
            personnels_declarations: [],
            gta_codages: [],
            selectedPointages: [],
            week: ['Monday', 'tuesday', 'wednesday', 'thursday', 'Friday', 'Saturday', 'Sunday'],
            resumePointageOptions: ['Total heures', 'Heures normales', 'Heures nuit', 'Prime A', 'Alerts'],
            pending: {
                week: true
            }
        }
    },

    computed: {
        /**
         * Retourne la liste des jours entre dd et df.
         * La valeur retournée est une collection d'objets Date
         * @returns {Array}
         */
        weekDays() {
            let dd = new Date(this.semaine.dd);
            let days = [];

            for (let i=0; i<7; i++) {
                let date = new Date(dd);
                date.setDate(dd.getDate() + i);
                days.push(date);
            }

            return days;
        }
    },

    watch: {
        semaine() {
            this.loadDeclarations();
        }
    },

    components: {
        PointageCard,
        UserImage,
        Spinner
    },

    methods: {
        /**
         * add or remove in array selectedPointages an pointage
         * 
         * @param {Array} payload 
         */
        selectedPointage(payload) {
            console.log(payload);
            if(payload[1] === 'add') {
                this.selectedPointages.push(payload[0]);
            } else {
                for(let pointage in this.selectedPointages) {
                    if(this.selectedPointages[pointage] == payload[0]) {
                        this.selectedPointages[pointage].splice();
                    }
                }
            }
        },

        /**
         * Get the day number and month number 
         * if the length is equal at 1, add '0' before the number
         * 
         * @param {Date} date 
         */
        dateToDayMonth(date) {
            let dd = new Date(date);
            return dd.toLocaleDateString('fr-FR', {day:'2-digit', month: '2-digit'});
        },


        /**
         * Charge les déclarations depuis le serveur
         */
        loadDeclarations() {
            let apiUrl = 'structureTempsDeclaration/GET/listDeclarations';

            this.pending.week = true;

            this.$app.apiGet(apiUrl, {
                dd: this.semaine.dd,
                df: this.semaine.df,
                group_by_personnel: true
            })
            .then( (data) => {
                console.log(data);
                this.personnels_declarations = data.personnels;
                this.gta_codages = data.gta_codages;

                this.pending.week = false;
            })
            .catch(this.$app.catchError);
        },

        /**
         * Retourne une collection de période basées sur le même jour que la date passée 
         * en paramètre
         * 
         * @param {Array} periodes Liste des periodes à analyser
         * @param {Date} date L'objet représentant le jour
         * 
         * @returns {Array}
         */
        getPeriodesFromDate(periodes, date) {
            return periodes.filter(e => e.period_year == date.getFullYear() && e.period_month == (date.getMonth()+1) && e.period_day == date.getDate());
        },

        // À guillaume : en chantier
        // getCompteurs(personnel) {
        //     let compteurs = {};

        //     personnel.gta_periodes.forEach(gta_periode => {
        //         gta_periode.structure_temps_declarations.forEach(std => {
        //             let dd = new Date(std.dd_correction ? std.dd_correction : std.dd);
        //             let df = new Date(std.df_correction ? std.df_correction : std.df);

        //             let ddp = new Date(std.ddp_correction ? std.ddp_correction : std.ddp);
        //             let dfp = new Date(std.dfp_correction ? std.dfp_correction : std.dfp);

        //             let hours = Math.abs(dd - df) / 36e5 - Math.abs(ddp - dfp) / 36e5;

        //             if (!compteurs.normal) {
        //                 compteurs.normal = {};
        //             }
        //         });
        //     });
        // }
    },

    mounted() {
        this.loadDeclarations();
    }

}
</script>