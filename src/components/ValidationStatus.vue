<template>
    <div class="mb-2" v-if="gtaPeriode.valider !== null">
        <div class="text-center p-1 alert" :class="validationClass">
            {{labelStatus}}
            <div class="d-grid mt-2">
                <button class="btn btn-sm btn-outline-secondary" @click.prevent="resetPeriodeValidation">
                    <i class="bi me-1" :class="{'bi-arrow-counterclockwise' : !pending.periode, 'spinner-border spinner-border-sm' : pending.periode}">
                    </i> Ré-initialiser </button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        gtaPeriode: Object
    },

    emits: ['refresh'],

    data() {
        return {
            pending: {
                periode: false
            }
        }
    },

    computed: {
        /**
         * Retourne le contenu de l'alert en fonction de l'état de validation de la période.
         * 
         * @return {string}
         */
        labelStatus() {
            if(this.gtaPeriode.valider == 'OUI') {
                return 'Période validée';
            } else {
                return 'Période refusée';
            }
        },

        /**
         * Retourne la classe bootstrap en fonction de l'état de validation de la période.
         * 
         * @return {string}
         */
        validationClass() {
            if (this.gtaPeriode.valider == 'OUI') return 'alert-success';
            else if (this.gtaPeriode.valider == 'NON') return 'alert-danger';
            return '';
        }
    },

    methods: {
        /**
         * Réinitialise l'état de validation de la période à null
         */
        resetPeriodeValidation() {
            if (confirm("Souhaitez vous ré-initialiser l'état de validation ?")) {
                this.pending.periode = true;

                this.$app.apiPost('gtaPeriode/POST/'+ this.gtaPeriode.id +'/reset')
                .then(data => {
                    this.$emit('refresh', data);
                })
                .catch(this.$app.catchError)
                .finally(() => {
                    this.pending.periode = false;
                });
            }
        }
    }
}

</script>