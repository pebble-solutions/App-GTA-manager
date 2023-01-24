<template>
    <div class="row g-3 mb-3">
        <div class="col">
            <label for="export_dd" class="form-label">Date de début</label>
            <input type="date" class="form-control" id="export_dd" :value="dd" @input="changeVal('dd', $event)" required>
        </div>

        <div class="col">
            <label for="export_df" class="form-label">Date de fin</label>
            <input type="date" class="form-control" id="export_df" :value="df" @input="changeVal('df', $event)" required>
        </div>
    </div>

    <div class="mb-3">
        <label for="export_type" class="form-label">Type d'export</label>
        <select name="type" id="export_type" class="form-select" :value="type" @change="changeVal('type', $event)">
            <option value="group">Export groupé des compteurs</option>
            <!--<option value="list">Export des déclarations en liste</option>-->
        </select>
    </div>

    <div class="mb-3">
        <label for="export_structure__personnel_id" class="form-label">Personnel</label>
        <select name="structure__personnel_id" id="export_structure__personnel_id" class="form-select" :value="structure__personnel_id" @change="changeVal('structure__personnel_id', $event)">
            <option value="">Tous</option>
            <option :value="personnel.id" v-for="personnel in personnels" :key="personnel.id">{{ personnel.cache_nom }}</option>
        </select>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
        dd: String,
        df: String,
        type: String,
        structure__personnel_id: Number
    },

    emits: ['update:dd', 'update:df', 'update:type', 'update:structure__personnel_id'],

    computed: {
        ...mapState(['personnels'])
    },

    methods: {
        /**
         * Met à jour une valeur du formulaire
         * 
         * @param {string} key Nom de la propriéter à muter
         * @param {object} event Événement déclencheur contenant target.value
         */
        changeVal(key, event) {
            this.$emit('update:'+key, event.target.value);
        }
    }
}

</script>