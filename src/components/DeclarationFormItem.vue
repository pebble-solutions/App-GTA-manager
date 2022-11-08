<template>
    <div class="list-group-item d-flex justify-content-between align-items-center px-0" v-if="declaration.correction === null && declaration.qte != 0.00 || declaration.correction === 'OUI' && declaration.qte_retenue != 0.00 && declaration.qte_retenue !== null || declaration.corretion === 'NON' && declaration.qte != 0.00">

        <label :for="'declaration-qte-input-'+declaration.id" :title="codage_label">{{codage_label}}</label>

        <div class="box-qte">
            <div class="input-group input-group-sm ms-auto">
                <button type="button" class="btn btn-outline-secondary input-group-text" @click.prevent="incrementQte(-1)">
                    <i class="bi bi-dash-lg"></i>
                </button>
                
                <input type="text" class="form-control text-center" v-model="value" :id="'declaration-qte-input-'+declaration.id">

                <button type="button" class="btn btn-outline-secondary input-group-text" @click.prevent="incrementQte(1)">
                    <i class="bi bi-plus-lg"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .box-qte {
        width: 120px;
    }
</style>

<script>
import { mapActions } from 'vuex'

export default {
    props: {
        declaration: Object
    },

    emits: ['qte-change'],

    data() {
        return {
            value: 0,
            codage_label: 'Chargement...'
        }
    },

    watch: {
        /**
         * Affecte une nouvelle valeur à la déclaration.
         * @param {Number} newVal Nouvelle valeur
         */
        value(newVal) {
            this.$emit('qte-change', newVal);
        }
    },

    methods: {
        ...mapActions(['getCodageLabelFromId']),

        /**
         * Update the qte result of the declaration,
         * @param {Number} value La qualité à incrémenter
         */
        incrementQte(value) {
            this.value = parseFloat(this.value) + value;
        }
    },

    mounted() {
        this.value = this.declaration.qte_retenue === null || typeof this.declaration.qte_retenue === 'undefined' || this.declaration.qte_retenue === '' ? this.declaration.qte : this.declaration.qte_retenue;
        if (!this.value) this.value = 0;

        this.getCodageLabelFromId(this.declaration.gta__codage_id)
        .then((label) => {
            this.codage_label = label;
        });
    }
}

</script>