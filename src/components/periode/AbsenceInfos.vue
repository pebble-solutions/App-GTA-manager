<template>
    <div :class="`alert ${absenceCard[0]}`" v-if="id">
        <div>
            <i :class="`bi ${absenceCard[1]}`"></i>
            <span class="mx-1">Periode d'absence {{ absenceMessage }}</span>
        </div>
        <i class="bi bi-calendar"></i>
        <span class="mx-1"> {{ ddAbsence }} <i class="bi bi-caret-right"></i> {{ dfAbsence }}</span>

    </div>
    <div v-else>
        <div class="alert alert-warning">
            Informations sur l'absence non trouvées
        </div>
    </div>
</template>

<script>

export default {
    props: {
        personnel: Object,
        etatAbsence: String,
    },

    data() {
        return {
            ddAbsence: null,
            dfAbsence: null,
            id: null,
        };
    },

    computed: {

        /**
         * Met a jour la valeur du message de l'etat de l'absence
         * 
         * @return {string} Valeur du message de l'état de l'absence en fonction de la validation
         */
        absenceMessage(){
            let messageEtatAbsence = 'demandée';

            if (this.etatAbsence === "OUI") {
                messageEtatAbsence = 'validée'
            } else if (this.etatAbsence === "NON"){
                messageEtatAbsence = 'refusée'
            } 
            return messageEtatAbsence
        },

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
            let absence = this.personnel.gta_periodes[0].gta_absence
            this.id = absence.id;

            
            let [year, monthdd, monthdf, dd, df] = [absence.df.slice(0,4), absence.dd.slice(5,7), absence.df.slice(5,7), absence.dd.slice(8,10), absence.df.slice(8,10)];
            
            this.ddAbsence = `${dd}/${monthdd}`;
            this.dfAbsence = `${df}/${monthdf}/${year}`;
        },

    },  

    mounted() {
        this.datePeriodeAbsence();
    }

}
</script>