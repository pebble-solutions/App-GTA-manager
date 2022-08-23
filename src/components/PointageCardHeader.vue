<template>
    <div v-if="!displayMoreInfosTiming">
        <div v-if="Object.keys(pointage).length !== 0">
            <div v-if="pointage.clock_status === 'open'" class="text-center my-2">
                <div>
                    début 
                    <span v-if="pointage.dd_correction && pointage.dd_correction != '0000-00-00 00:00:00'">
                        {{new Date(pointage.dd_correction).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                    </span>
    
                    <span v-else>
                        {{new Date(pointage.dd).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                    </span>
                </div>
    
                <div>En cours...</div>
            </div>
            
            <div    class="rounded-0 mb-0 d-flex align-items-center py-1" 
                    :class="{
                        'alert alert-success border-success': periode.valider === 'OUI', 
                        'alert alert-danger border-danger': periode.valider === 'NON', 
                        'px-3': periode.valider !== 'NON' && periode.valider !== 'OUI'
                    }" 
                    
                    v-else>
                <PointageCardStatus :periode="periode" :selected="selected" />
    
                <div class="fs-5 fw-bold">
                    <span v-if="periode.valider !== 'OUI' && periode.valider !== 'NON'" role="button">{{dureetravail}}</span>
                    <span v-else>{{dureetravail}}</span>
                </div>
    
                <div v-if="getGtaDeclarationsNotEmpty" class="ms-auto">
                    <div v-if="getGtaDeclarationsNotEmpty.length > 0" class="badge bg-secondary">
                        {{getGtaDeclarationsNotEmpty.length}}
                    </div>
                </div>
            </div>
        </div>
    
        <div v-else>
            <div    class="rounded-0 mb-0 d-flex align-items-center py-1" 
                    :class="{
                        'alert alert-success border-success': periode.valider === 'OUI', 
                        'alert alert-danger border-danger': periode.valider === 'NON', 
                        'px-3': periode.valider !== 'NON' && periode.valider !== 'OUI'
                    }">
                <PointageCardStatus :periode="periode" :selected="selected" />
    
                <div v-if="personnel.forfait_jour === 'OUI'">
                    <span v-if="periode.valider !== 'OUI' && periode.valider !== 'NON'" role="button">Forfait J.</span>    
                    <span v-else>Forfait J.</span>    
                </div>

                <div v-else>
                    <span v-if="periode.valider !== 'OUI' && periode.valider !== 'NON'" role="button">Sans durée</span>
                    <span v-else>Sans durée</span>
                </div>

                <div v-if="getGtaDeclarationsNotEmpty" class="ms-auto">
                    <div v-if="getGtaDeclarationsNotEmpty.length > 0" class="badge bg-secondary">
                        {{getGtaDeclarationsNotEmpty.length}}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="card-body text-center d-flex justify-content-between align-items-center"  v-else>
        <div class="text-secondary" v-if="periode.valider !== 'OUI' && periode.valider != 'NON'">
            <i class="bi bi-square" role="button" v-if="!selected"></i>
            <i class="bi bi-check2-square square-color" role="button" v-else></i>
        </div>

        <div class="ms-auto">
            <router-link    :to="{name: 'EditPointage', params: {idPeriode: periode.id}}" 
                            custom v-slot="{navigate, href}"
                            
                            v-if="periode.valider !== 'OUI' && periode.valider != 'NON'">
                <a :href="href" @click.stop="navigate" class="text-primary text-decoration-none">
                    <i class="bi bi-pencil-square "></i>
                    Modifier
                </a>
            </router-link>
            
            <div class="text-success" v-else-if="periode.valider == 'OUI'">
                <i class="bi bi-lock-fill"></i>
                Validé
            </div>
            <div class="text-danger" v-else>
                <i class="bi bi-lock-fill"></i>
                Refusé
            </div>
        </div>
    </div>






























    <!-- <div class="text-center my-2" v-if="pointage.clock_status !== 'over' && !displayMoreInfosTiming && personnel.forfait_jour !== 'OUI' && pointage.lenght > 0">
        <div>
            début 
            <span v-if="pointage.dd_correction && pointage.dd_correction != '0000-00-00 00:00:00'">
                {{new Date(pointage.dd_correction).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
            </span>

            <span v-else>
                {{new Date(pointage.dd).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
            </span>
        </div>
        <div>En cours...</div>
    </div>
 
    <div class="card-body text-center d-flex justify-content-between align-items-center" v-else-if="displayMoreInfosTiming && pointage.clock_status === 'over' && pointage.lenght > 0 || personnel.forfait_jour === 'OUI' && displayMoreInfosTiming ">
        <div class="text-secondary" v-if="periode.valider !== 'OUI' && periode.valider != 'NON'">
            <i class="bi bi-square" role="button" v-if="!selected"></i>
            <i class="bi bi-check2-square square-color" role="button" v-else></i>
        </div>

        <div class="ms-auto">
            <router-link :to="{name: 'EditPointage', params: {idStd: pointage.id}}" custom v-slot="{navigate, href}" v-if="periode.valider !== 'OUI' && periode.valider != 'NON'">
                <a :href="href" @click.stop="navigate" class="text-primary text-decoration-none">
                    <i class="bi bi-pencil-square "></i>
                    Modifier
                </a>
            </router-link>
            
            <div class="text-success" v-else-if="periode.valider == 'OUI'">
                <i class="bi bi-lock-fill"></i>
                Validé
            </div>
            <div class="text-danger" v-else>
                <i class="bi bi-lock-fill"></i>
                Refusé
            </div>
        </div>
    </div>

    <div class="rounded-0 mb-0 d-flex align-items-center py-1" :class="{'alert alert-success border-success': periode.valider === 'OUI', 'alert alert-danger border-danger': periode.valider === 'NON', 'px-3': periode.valider !== 'NON' && periode.valider !== 'OUI'}" v-else>
        <div>
            <div class="text-secondary me-2" v-if="periode.valider !== 'OUI' && periode.valider != 'NON'">
                <i class="bi bi-square" role="button" v-if="!selected"></i>
                <i class="bi bi-check2-square square-color" role="button" v-else></i>
            </div>

            <div class="text-success me-2" v-if="periode.valider === 'OUI'">
                <i class="bi bi-check2-circle"></i>
            </div>

            <div class="text-danger me-2" v-if="periode.valider === 'NON'">
                <i class="bi bi-x-octagon"></i>
            </div>
        </div>

        <div v-if="personnel.forfait_jour !== 'OUI'">
            <div class="fs-5 fw-bold">
                {{dureetravail}}
            </div>
    
            <div v-if="getGtaDeclarationsNotEmpty" class="ms-auto">
                <div v-if="getGtaDeclarationsNotEmpty.length > 0" class="badge bg-secondary">
                    {{getGtaDeclarationsNotEmpty.length}}
                </div>
            </div>
        </div>

        <div v-else>
            Forfait jour
        </div>
    </div> -->

</template>

<script>
import PointageCardStatus from './PointageCardStatus.vue';
export default {
    props: {
        pointage: Object,
        periode: Object,
        displayMoreInfosTiming: Boolean,
        getGtaDeclarationsNotEmpty: Array,
        dureetravail: String,
        selected: Boolean,
        personnel: Object
    },

    components: { PointageCardStatus }
}
</script>