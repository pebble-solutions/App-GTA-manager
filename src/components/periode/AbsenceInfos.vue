<template>
    <div :class="`alert ${absenceCard[0]}`">
        <div>
            <i :class="`bi ${absenceCard[1]}`"></i>
            <span class="mx-1">Periode d'absence (validée/refusée/demandée)</span>
        </div>
        <i class="bi bi-calendar"></i>
        <span class="mx-1"> {{ ddAbsence }} bi {{ dfAbsence }}</span>

        si pas de clé gta_absence, alors message "informations sur l'absence non trouvées"
    </div>
</template>

<script>

export default {
    props: {
        periode: Object,
        personnel: Object,
        etatAbsence: String,
    },

    data() {
        return {
            ddAbsence: null,
            dfAbsence: null,
        };
    },

    computed: {

         /**
         * Retourne un tableau de string pour le style bootstraps de l'absence en fonction de l'etat de validation
         * 
         * @return {array}
         */
        absenceCard() {
            const statusMap = {
                OUI: ["alert-success", "bi-check"],
                NON: ["alert-danger", "bi-x"],
            };

            return statusMap[this.etatAbsence] || ["alert-primary", "bi-app"];
        },
    },

    methods: {

        /**
         * Met a jour les valeurs de date de debut et de fin de la periode d'absence
         */
        datePeriodeAbsence() {
            const periodes = this.personnel.gta_periodes.filter(p => p.gta_absence_id);

            const start = new Date();
            let [year, monthdd, monthdf, dd, df] = [start.getFullYear(), null, null, null, null];

            for (const periode of periodes) {
                if (year < periode.period_year) {
                    year = periode.period_year;
                }
                if (dd === null || dd > periode.period_day) {
                    dd = periode.period_day;
                    monthdd = periode.period_month;
                }
                if (df === null || df < periode.period_day) {
                    df = periode.period_day;
                    monthdf = periode.period_month;
                }
                if (monthdd > monthdf) {
                    this.dfAbsence = `${dd.toString().padStart(2, '0')}/${monthdd.toString().padStart(2, '0')}/${year}`;
                    this.ddAbsence = `${df.toString().padStart(2, '0')}/${monthdf.toString().padStart(2, '0')}`;
                } else {
                    this.ddAbsence = `${dd.toString().padStart(2, '0')}/${monthdd.toString().padStart(2, '0')}`;
                    this.dfAbsence = `${df.toString().padStart(2, '0')}/${monthdf.toString().padStart(2, '0')}/${year}`;
                }
            }
        },

    },  

    mounted() {
        this.datePeriodeAbsence();
    }

}
</script>