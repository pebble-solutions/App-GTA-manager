<template>
    <div class="card mb-2 fs-7" :class="{'border border-info shadow-info': selected, 'border border-success': validate, 'shadow': !selected}" @click="selected = !selected">
        <div class="card-body text-center px-0">
            <div class="text-end px-4 pb-2">
                <router-link :to="{name: 'EditPointage'}" custom v-slot="{navigate, href}">
                    <a :href="href" @click.stop="navigate" class="text-primary text-decoration-none">
                        <i class="bi bi-pencil-square "></i>
                        Modifier
                    </a>
                </router-link>
                
                <div class="text-success">
                    <i class="bi bi-lock-fill"></i>
                    Validé
                </div>
            </div>

            <div class="mb-3">
                <div>Service en salle</div>
                <div>Projet Non-définie</div>
            </div>

            <div class="alert alert-warning border-top border-bottom border-warning rounded-0 mb-0">
                <div class="moreInfosTiming">
                    <div>Durée de travail</div>
                    <div class="fs-5 fw-bold">7h</div>
                    <div class="fs-8  fst-italic">La durée journalière standard est dépassée</div>
                </div>

                <transition name="vertical-slide">
                    <div v-show="displayMoreInfosTiming">
                        <div class="border-top border-bottom border-warning py-2 my-2 moreInfosTiming">
                            <div>Pause</div>
                            <div class="fs-5 fw-bold">1h00</div>
                            <div>12h <i class="bi bi-chevron-right"></i> 13h</div>
                        </div>

                        <div>
                            <div>Amplitude</div>
                            <div class="fs-5 fw-bold">12h00</div>
                            <div>8h00 <i class="bi bi-chevron-right"></i> 20h00</div>
                            <div>L'Amplitude journalière maximum est dépassée</div>
                        </div>
                    </div>
                </transition>

            </div>

            <button class="btn btn-warning w-100 rounded-0 d-flex justify-content-between align-items-center px-3" @click.stop="displayMoreInfosTiming = !displayMoreInfosTiming">
                <i class="bi" :class="{'bi-chevron-double-up': displayMoreInfosTiming, 'bi-chevron-double-down': !displayMoreInfosTiming}"></i>                                     
                <div>détails</div>                                  
                <i class="bi" :class="{'bi-chevron-double-up': displayMoreInfosTiming, 'bi-chevron-double-down': !displayMoreInfosTiming}"></i>                                     
            </button>

            <div class="px-4 mt-3">
                <div class="text-start border-top border-secondary">
                    <h3 class="fs-7 fw-bold">Justification</h3>

                    <AlertMessage variant="warning">Une justification a donner</AlertMessage>
                </div>
            </div>

            <div class="px-4 mt-3 fw-bold cursor-pointer" @click.stop="displayMoreInfosReport = !displayMoreInfosReport">
                <div class="d-flex justify-content-between align-items-start border-top border-secondary">
                    <h3 class="fs-7 fw-bold">
                        6 infos
                    </h3>

                    <i class="bi" :class="{'bi-chevron-double-up': displayMoreInfosTiming, 'bi-chevron-double-down': !displayMoreInfosTiming}"></i>  
                </div>
            </div>

            <div class="px-4 py-3" v-show="displayMoreInfosReport">
                <ul class="px-0">
                    <li class="d-flex justify-content-between align-items-start px-0 pb-0 border-dashed pt-2">
                        <span class="text-start">Repas</span>
                        <span>1</span>
                    </li>
                    <li class="d-flex justify-content-between align-items-start px-0 pb-0 border-dashed pt-2">
                        <span class="text-start">Pause</span>
                        <span>1</span>
                    </li>
                    <li class="d-flex justify-content-between align-items-start px-0 pb-0 border-dashed pt-2">
                        <span class="text-start">Prime</span>
                        <span>1</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <router-view ></router-view>
</template>

<style lang="scss" scoped>
    .shadow-info {
        box-shadow: 0 0.5rem 1rem rgba(13, 202, 240, .15);
    }
</style>

<script>
import AlertMessage from '@/components/pebble-ui/AlertMessage.vue'

export default {
    props: {
        pointage: Object
    },

    data() {
        return {
            displayMoreInfosTiming : false,
            displayMoreInfosReport : false,
            selected: false
        }
    },

    components: {
        AlertMessage
    }
}
</script>