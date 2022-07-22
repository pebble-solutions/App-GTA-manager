<template>
    <tbody class="table-group-divider">
        <!-- <tr class="text-center" v-for="(resume, key) in getSummary(personnel)" :key="'resumme-'+key"> 
            <td :rowspan="rowspan[personnel.id]" class="text-center" v-if="key == 0">
                <UserImage :name="personnel.cache_nom" size="user-image-lg" class-name="my-1"></UserImage>
                <div>{{personnel.cache_nom}}</div>
            </td>

            <td class="text-start">
                <span v-if="frSummary[resume]">{{frSummary[resume]}}</span>
                <span v-else>{{resume}}</span>
            </td>

            <td v-for="day in weekDays" :key="'th-'+day">
                {{valueSummaryDay(personnel.counters.days_summary, day, resume)}}
            </td>

            <td>
                {{valueSummaryWeek(personnel.counters.weeks_summary[yearWeek], resume)}}
            </td>
        </tr> -->

        <Summary v-for="(resume, key) in getSummary(personnel)" 
            :key="'resume-'+key"
            :personnel="personnel"
            :resume="resume"
            :weekDays="weekDays"
        ></Summary>

        <tr v-if="personnels_declarations">
            <td></td>

            <td class="col-day" v-for="day in weekDays" :key="'personnel-'+personnel.id+'-'+day.getDate()">
                <template v-for="periode in getPeriodesFromDate(personnel.gta_periodes, day)" :key="'periode-'+periode.id">
                    <template v-if="periode.structure_temps_declarations.length > 0">
                        <PointageCard 
                            @select-pointage="selectedPointage"

                            :pointage="std" 
                            :gta_declarations="periode.gta_declarations"
                            :gta_codages="gta_codages"
                            
                            v-for="std in periode.structure_temps_declarations" 
                            :key="'declaration-'+periode.id+'-'+std.id"></PointageCard>
                    </template>

                    <template v-else-if="periode.gta_declarations.length > 0 && periode.structure_temps_declarations.length == 0">
                        <GtaDeclarationsList :gta_declarations="periode.gta_declarations" :gta_codages="gta_codages" :card="true"></GtaDeclarationsList>
                    </template>

                    <template v-else>
                        <div class="card border border-2">
                            <div class="card-body text-center">
                                Periode Vide

                                <button class="btn btn-danger">
                                    <i class="bi bi-trash"></i>
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </template>
                </template>
            </td>

            <td class="col-day"></td>
        </tr>
    </tbody>
</template>

<script>
import Summary from '@/components/Summary.vue';

export default {
    props: {
        personnel: Object,
        weekDays: Array,
        gta_codages: Object
    },

    components: {
        Summary
    }
}
</script>

