<template>
    <div class="mb-3">
        <label class="form-label">Personnel</label>
        <select name="structure__personnel_id" id="insert_structure__personnel_id" class="form-select" v-model = "selectedId" required>
            <option :value="personnel.id" v-for="personnel in personnels" :key="personnel.id">{{ personnel.cache_nom }}</option>
        </select>
    </div>

    <div class="mb-3 d-flex flex-column">
        <label class="form-label">Journée</label>
        <div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">

            <template v-for="day in dayDict" :key="day.key">
                <input type="radio" class="btn-check" name="check-day" :id="'btn-check-day-'+day.key" autocomplete="off" v-on:click="getDate(day.key)" required>
                <label class="btn btn-outline-primary" :for="'btn-check-day-'+day.key">{{ day.label }}</label>
            </template>

        </div>
    </div>
</template>

<script>

import { mapState } from 'vuex';

export default {
    data(){
        return{
            selectedId: null,
            selectedDate: Date,
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
        selectedId(newVal){
            this.$emit('update:structure__personnel_id', parseInt(newVal));
        },
        selectedDate(newVal){
            this.$emit('update:newDate', newVal)
        },
    },
    props: {
        structure__personnel_id: Number,
        newDate: Date,
        semaine: Object
    },

    emits: ['update:structure__personnel_id','update:newDate'],

    computed: {
        ...mapState(['personnels'])
    },
    methods: {

        /**
         * Met à jour la date
         * 
         * @param {*} id Cle du jour de la semaine
         */
        getDate(id){
            let date = new Date(this.semaine.dd);
            date.setDate(date.getDate() + id);
            this.selectedDate = date;

                //     if(semaine.dd.slice(5,7)== '02' && parseInt(semaine.dd.slice(8))+id > 28){
                //         this.$emit('update:newDate',semaine.dd.slice(0,5)+"0"+(parseInt(semaine.dd.slice(5,7))+1)+"-"+(parseInt(semaine.dd.slice(8))+id-28));
                //     }else if(parseInt(semaine.dd.slice(8))+id > 31){
                //         if(parseInt(semaine.dd.slice(5,7)) < 9){
                //             this.$emit('update:newDate',semaine.dd.slice(0,5)+"0"+(parseInt(semaine.dd.slice(5,7))+1)+"-"+(parseInt(semaine.dd.slice(8))+id-31));
                //         }else{
                //             this.$emit('update:newDate',semaine.dd.slice(0,5)+(parseInt(semaine.dd.slice(5,7))+1)+"-"+(parseInt(semaine.dd.slice(8))+id-31));
                //         }   
                //         if(parseInt(semaine.dd.slice(5,7)) == 12){
                //             this.$emit('update:newDate',(parseInt(semaine.dd.slice(0,4))+1)+"-01-"+(parseInt(semaine.dd.slice(8))+id-31))
                //         }
                //     }else{
                //         this.$emit('update:newDate', semaine.dd.slice(0,8)+(parseInt(semaine.dd.slice(8))+id));
                //     }
        }
    },
    mounted() {
        this.selectedId = this.structure__personnel_id;
        this.selectedDate = this.newDate;
    }
}

</script>