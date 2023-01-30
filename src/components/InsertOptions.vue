<template>
    <div class="mb-3">
        <label class="form-label">Personnel</label>
        <select name="structure__personnel_id" id="insert_structure__personnel_id" class="form-select" v-model="selectedId" required>
            <option :value="personnel.id" v-for="personnel in personnels" :key="personnel.id">{{ personnel.cache_nom }}</option>
        </select>
    </div>

    <div class="mb-3 d-flex flex-column">
        <label class="form-label">Journée</label>
        <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">

            <template v-for="day in dayDict" :key="day.key">
                <input type="radio" class="btn-check" name="check-day" :id="'btn-check-day-'+day.key" autocomplete="off" :value="day.key" v-model="selectedDateKey" required>
                <label class="btn btn-outline-primary" :for="'btn-check-day-'+day.key">{{ day.label }}</label>
            </template>

        </div>
    </div>
</template>

<script>

import { mapState } from 'vuex';

export default {
    data() {
        return {
            selectedId: null,
            selectedDateKey: null,
            dayDict: [
                {label: 'Lun.', key: 0},
                {label: 'Mar.', key: 1},
                {label: 'Merc.', key: 2},
                {label: 'Jeu.', key: 3},
                {label: 'Ven.', key: 4},
                {label: 'Sam.', key: 5},
                {label: 'Dim.', key: 6},
            ]
        }
    },
    watch: {
        /**
         * Lors de la mise à jour des informations du formulaire, un événement d'update est 
         * envoyé à l'élément parent.
         * 
         * @param {number} newVal Nouvelle valeur
         */
        selectedId(newVal){
            this.$emit('update:structure__personnel_id', parseInt(newVal));
        },

        /**
         * @param {number} newVal Nouvelle valeur
         */
        selectedDateKey(newVal) {
            let date = new Date(this.semaine.dd);
            date.setDate(date.getDate() + newVal);
            this.$emit('update:newDate', date)
        }
    },

    props: {
        structure__personnel_id: Number,
        newDate: Date,
        semaine: Object
    },

    emits: ['update:structure__personnel_id', 'update:newDate'],

    computed: {
        ...mapState(['personnels'])
    },

    mounted() {
        this.selectedId = this.structure__personnel_id;
        this.selectedDateKey = this.newDate.getDay() - 1;
        if (this.selectedDateKey < 0) {
            this.selectedDateKey = 6;
        }
    }
}

</script>