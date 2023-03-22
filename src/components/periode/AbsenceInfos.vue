<template>
    <div class="fs-7 alert" :class="alertClassName" v-if="id">
        <div>
            <i class="bi" :class="icon"></i>
            <span class="mx-1">Absence {{ absenceMessage }}</span>
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
        absence: Object
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
         * Retourne la classe bootstrap de l'alert
         * 
         * @return {string}
         */
        alertClassName() {
            if (this.absence.valider === 'OUI') return 'alert-success';
            else if (this.absence.valider === 'NON') return 'alert-danger';
            return 'alert-primary';
        },

        /**
         * Met a jour la valeur du message de l'etat de l'absence
         * 
         * @return {string} Valeur du message de l'état de l'absence en fonction de la validation
         */
        absenceMessage(){
            let messageEtatAbsence = 'demandée';

            if (this.absence.valider === "OUI") {
                messageEtatAbsence = 'validée'
            } else if (this.absence.valider === "NON"){
                messageEtatAbsence = 'refusée'
            } 
            return messageEtatAbsence
        },

         /**
         * Retourne l'icon bootstrap en fonction de l'état de validation
         * 
         * @return {string}
         */
        icon() {
            if (this.absence.valider === 'OUI') return 'bi-check';
            else if (this.absence.valider === 'NON') return 'bi-x';
            return 'bi-app';
        },
    },

    methods: {
        /**
         * Met a jour les valeurs de date de debut et de fin de la periode d'absence
         */
        datePeriodeAbsence() {
            let absence = this.absence;
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