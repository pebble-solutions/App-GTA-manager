<template>
    <div class="table-responsive">
        <table class="table table-bordered table-sm">
            <thead class="align-middle text-center table-secondary">
                <tr>
                    <th class="col-day">Personnel</th>
                    <th class="col-day"></th>

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

                    <th class="col-day">
                        <div>S12</div>
                    </th>
                </tr>
            </thead>

            <tbody v-for="i in [0]" :key="i" class="table-group-divider"> <!-- composant du personnel -->
                <tr class="text-center">
                    <td rowspan="6" class="text-center">
                        <UserImage :imageUrl="personnel.imageUrl" :name="personnel.cache_nom"></UserImage>
                        <div class="fs-5">Seb Dupond</div>
                    </td>

                    <td class="text-start">
                        Total heures
                    </td>

                    <td  class="col-day">6</td>
                    <td  class="col-day">8</td>
                    <td  class="col-day"></td>
                    <td  class="col-day">6</td>
                    <td  class="col-day"></td>
                    <td  class="col-day"></td>
                    <td  class="col-day"></td>
                    <td  class="col-day"></td>
                </tr>

                <tr class="text-center">
                    <td class="text-start">
                        Heures normales
                    </td>

                    <td class="col-day">6</td>
                    <td class="col-day">8</td>
                    <td class="col-day"></td>
                    <td class="col-day">6</td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                </tr>
                <tr class="text-center">
                    <td class="text-start">
                        Heures nuit
                    </td>

                    <td class="col-day"></td>
                    <td class="col-day"></td>
                    <td class="col-day">2</td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                </tr>
                <tr class="text-center">
                    <td class="text-start">
                        Prime A
                    </td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                    <td class="col-day">1</td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                </tr>
                <tr class="text-center">
                    <td class="text-start">
                        Alerts
                    </td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                    <td class="col-day">AJM</td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                </tr>
                <tr>
                    <td></td>
                    <td class="col-day"> <!-- Components pointage-->
                        <PointageCard></PointageCard>
                    </td> 
                    <td class="col-day"> <!-- Components pointage-->
                        <PointageCard></PointageCard>
                    </td> 
                    <td class="col-day"> <!-- Components pointage-->
                        <PointageCard></PointageCard>
                    </td> 
                    <td class="col-day"> <!-- Components pointage-->
                        <PointageCard></PointageCard>
                    </td> 
                    <td class="col-day"> <!-- Components pointage-->
                        <PointageCard></PointageCard>
                    </td> 
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                    <td class="col-day"></td>
                </tr>
            </tbody>
        </table>
    </div>

    <router-view ></router-view>
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
        width: 150px;
    }

</style>

<script>
import PointageCard from '@/components/PointageCard.vue';
import UserImage from '@/components/pebble-ui/UserImage.vue';

export default {
    inheritAttrs: false,

    data() {
        return {
            personnel : 
            {
                cache_nom : "Dupond Seb",
                imageUrl: "https://cdn-s-www.ledauphine.com/images/A2B51F63-FA5C-463B-B27E-3FDCDBDA7CFD/NW_raw/grumpy-cat-avait-7-ans-photo-twitter-1558093797.jpg",
            }
        }
    },

    components: {
        PointageCard,
        UserImage
    },

    mounted() {
    
    },
}
</script>