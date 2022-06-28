<template>
    <div class="table-responsive">
        <table class="table table-bordered table-sm">
            <thead class="align-middle text-center table-secondary">
                <tr>
                    <th class="col-day">Personnel</th>
                    <th class="col-day"></th>

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
                        <UserImage :name="personnel.cache_nom"></UserImage>
                        <div>{{personnel.cache_nom}}</div>
                    </td>

                    <td class="text-start">
                        Total heures
                    </td>

                    <td v-for="day in week" :key="'th-'+day"></td>
                </tr>

                <tr class="text-center">
                    <td class="text-start">
                        Heures normales
                    </td>

                    <td v-for="day in week" :key="'hnorm-'+day"></td>
                </tr>
                <tr class="text-center">
                    <td class="text-start">
                        Heures nuit
                    </td>

                    <td v-for="day in week" :key="'hnuit-'+day"></td>
                </tr>
                <tr class="text-center">
                    <td class="text-start">
                        Prime A
                    </td>

                    <td v-for="day in week" :key="'primesA-'+day"></td>
                </tr>
                <tr class="text-center">
                    <td class="text-start">
                        Alerts
                    </td>

                    <td v-for="day in week" :key="'hnorm-'+day"></td>
                </tr>
                <tr>
                    <td></td>

                    <td class="col-day" v-for="day in weekDays" :key="'personnel-'+personnel.id+'-'+day.getDate()">
                        <template v-for="periode in getPeriodesFromDate(personnel.gta_periodes, day)">
                            <PointageCard 
                                @selected-pointage="selectedPointage()"

                                :pointage="std" 
                                :gta_declarations="periode.gta_declarations"
                                :gta_codages="gta_codages"
                                
                                v-for="std in periode.structure_temps_declarations" 
                                :key="'declaration-'+periode.id+'-'+std.id"></PointageCard>
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
            resumePointageOptions: ['Total heures', 'Heures normales', 'Heures nuit', 'Prime A', 'Alerts']
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

    components: {
        PointageCard,
        UserImage
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

        loadDeclarations() {
            let apiUrl = 'structureTempsDeclaration/GET/listDeclarations';

            this.$app.apiGet(apiUrl, {
                dd: this.semaine.dd,
                df: this.semaine.df,
                group_by_personnel: true
            })
            .then( (data) => {
                console.log(data);
                this.personnels_declarations = data.personnels;
                this.gta_codages = data.gta_codages;
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
        }
    },

    updated () {
        //this.loadDeclarations();
    },

    mounted() {
        this.loadDeclarations();
    }

}
</script>