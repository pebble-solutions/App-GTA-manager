<template>
    <div class="table-responsive">
        <table class="table table-bordered table-sm">
            <thead class="align-middle text-center table-secondary">
                <tr>
                    <th>Personnel</th>
                    <th></th>

                    <th class="col-day">
                        <div>Lundi</div>
                        <div>06.06</div>
                    </th>

                    <th class="col-day">
                        <div>Mardi</div>
                        <div>07.06</div>
                    </th>

                    <th class="col-day">
                        <div>Mercredi</div>
                        <div>08.06</div>
                    </th>

                    <th class="col-day">
                        <div>Jeudi</div>
                        <div>09.06</div>
                    </th>

                    <th class="col-day">
                        <div>Vendredi</div>
                        <div>10.06</div>
                    </th>

                    <th class="col-day">
                        <div>Samedi</div>
                        <div>11.06</div>
                    </th>

                    <th class="col-day">
                        <div>Dimanche</div>
                        <div>12.06</div>
                    </th>

                    <th>
                        <div>S12</div>
                    </th>
                </tr>
            </thead>

            <tbody v-for="i in [0]" :key="i" class="table-group-divider"> <!-- composant du personnel -->
                <tr class="text-center">
                    <td rowspan="6" class="text-center">
                        <div class="fs-4">Seb Dupond</div>
                    </td>

                    <td class="text-start">
                        Total heures
                    </td>

                    <td>6</td>
                    <td>8</td>
                    <td></td>
                    <td>6</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>

                <tr class="text-center">
                    <td class="text-start">
                        Heures normales
                    </td>

                    <td>6</td>
                    <td>8</td>
                    <td></td>
                    <td>6</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr class="text-center">
                    <td class="text-start">
                        Heures nuit
                    </td>

                    <td></td>
                    <td></td>
                    <td>2</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr class="text-center">
                    <td class="text-start">
                        Prime A
                    </td>
                    <td></td>
                    <td></td>
                    <td>1</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr class="text-center">
                    <td class="text-start">
                        Alerts
                    </td>
                    <td></td>
                    <td></td>
                    <td>AJM</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td class="p-2"> <!-- Components pointage-->
                        <PointageCard></PointageCard>
                    </td> 
                    <td class="p-2"> <!-- Components pointage-->
                        <PointageCard></PointageCard>
                    </td> 
                    <td class="p-2"> <!-- Components pointage-->
                        <PointageCard></PointageCard>
                    </td> 
                    <td class="p-2"> <!-- Components pointage-->
                        <PointageCard></PointageCard>
                    </td> 
                    <td class="p-2"> <!-- Components pointage-->
                        <PointageCard></PointageCard>
                    </td> 
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss">
    .vertical-slides-enter-active,
    .vertical-slides-leave-active {
        transition: height .5s ease-in-out;
    }

    .vertical-slides-enter-from,
    .vertical-slides-leave-to {
        height: 0;
    }

    .col-day {
        max-width: 150px;
        min-width: 150px;
    }
</style>

<script>
import PointageCard from '@/components/PointageCard.vue';

export default {

    components: {
        PointageCard
    },

    mounted() {
        
    },
}
</script>