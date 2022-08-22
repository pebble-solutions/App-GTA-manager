<template>
    <div    class="text-center rounded-0 mb-0" 
            :class="{
                'alert alert-success border-success': periode.valider === 'OUI', 
                'alert alert-danger border-danger': periode.valider === 'NON', 
                'alert alert-secondary border-secondary': periode.valider !== 'NON' && periode.valider !== 'OUI'
            }">
        <div v-if="Object.keys(pointage).length !== 0">
            <div>
                <div v-if="pointage.clock_status !== 'over' && personnel.forfait_jour !== 'OUI'">
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
        
                <div v-else-if="pointage.clock_status === 'over' && pointage.forfait_jour !== 'OUI'">
                    <div>Durée de travail</div>
                    <div v-if="dureetravail" class="fs-5 fw-bold">{{dureetravail}}</div>
                </div>
            </div>
    
            <div class="border-top border-warning pt-2 mt-2" v-if="pause !== '00:00'">
                <div>Pause</div>
                <div class="fs-5 fw-bold">{{pause}}</div>
                <div>
                    <span v-if="pointage.dpd_correction && pointage.dpd_correction !== '0000-00-00 00:00:00'">
                        {{new Date(pointage.dpd_correction).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                    </span>
                    <span v-else-if="pointage.dpd_correction === '0000-00-00 00:00:00'">
                        00:00
                    </span>
                    <span v-else>
                        {{new Date(pointage.dpd).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                    </span>
    
                    <i class="bi bi-chevron-right"></i>
    
                    <span v-if="pointage.dfp_correction && pointage.dfp_correction !== '0000-00-00 00:00:00'">
                        {{new Date(pointage.dfp_correction).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                    </span>
                    <span v-else-if="pointage.dfp_correction === '0000-00-00 00:00:00'">
                        00:00
                    </span>
                    <span v-else>
                        {{new Date(pointage.dfp).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                    </span>
                </div>
            </div>
    
            <!-- <div class="border-top border-warning pt-2 mt-2" v-if="!pointage.dpd || pointage.dpd !== '0000-00-00 00:00:00'">
                <div>Amplitude</div>
                <div class="fs-5 fw-bold">{{amplitude}}</div>
                <div>
                    <span v-if="pointage.dd_correction && pointage.dd_correction != '0000-00-00 00:00:00'">
                        {{new Date(pointage.dd_correction).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                    </span>
                    <span v-else>
                        {{new Date(pointage.dd).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                    </span>
    
                    <i class="bi bi-chevron-right"></i>
    
                    <span v-if="pointage.df_correction && pointage.df_correction != '0000-00-00 00:00:00'">
                        {{new Date(pointage.df_correction).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                    </span>
                    <span v-else>
                        {{new Date(pointage.df).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                    </span>
                </div>
            </div> -->
    
            <div class="border-top border-warning pt-2 mt-2" v-if="pointage.justification">
                <div>
                    <h3 class="fs-7 fw-bold">Justification</h3>
    
                    <div class="text-secondary text-center fst-italic">{{pointage.justification}}</div>
                </div>
            </div>
        </div>

        <div v-else>
            <div v-if="personnel.forfait_jour === 'OUI'">Forfait Jour</div>
            <div v-else>Sans durée</div>
        </div>








    </div>
</template>

<script>

export default {
    props: {
        pointage: Object,
        periode: Object,
        dureetravail: String,
        pause: String,
        personnel: Object
    }
}
</script>