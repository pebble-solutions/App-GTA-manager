<template>

    <div class="list-group-item d-flex align-items-center justify-content-between px-0 py-1">
        <div class="text-start text-nowrap overflow-hidden codage-label text-secondary" :title="codage_label">{{codage_label}}</div>
        <span class="ms-1">{{qte}}</span>
    </div>

</template>

<style scoped>
.codage-label {
    max-width: 120px;
}
</style>

<script>
import { mapActions } from 'vuex';

export default {
    props: {
        GtaDeclaration: Object
    },

    data() {
        return {
            codage_label: null
        }
    },

    computed: {

        /**
         * Retourne qte ou qte_retenue si celle-ci est définie
         * 
         * @returns {number}
         */
        qte() {
            return this.GtaDeclaration.qte_retenue || this.GtaDeclaration.qte;
        }

    },

    methods: {
        ...mapActions(['getCodageLabelFromId'])
    },

    mounted() {
        this.getCodageLabelFromId(this.GtaDeclaration.gta__codage_id).then(label => this.codage_label = label);
    }
}

</script>