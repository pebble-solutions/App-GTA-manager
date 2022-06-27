<template>
    <div class="card border border-2 mb-2 fs-7" :class="{'border border-info border-2 shadow-info': selected, 'border border-success': validate, 'shadow': !selected}" @click="selectedAction()">
        <div class="card-body text-center d-flex justify-content-between align-items-center">
            <div class="text-secondary">
                <i class="bi bi-square" v-if="!selected"></i>
                <i class="bi bi-check2-square square-color" v-else></i>
            </div>  

            <div>
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

            <!-- <div class="mb-3">
                <div>Service en salle</div>
                <div>Projet Non-définie</div>
            </div> -->
        </div>
        
        <div class="text-center">
            <div class="alert alert-warning border-warning rounded-0 mb-0">
                <div>
                    <div>Durée de travail</div>
                    <div class="fs-5 fw-bold">7h</div>
                    <div class="fs-8 fst-italic lh-sm" style="">La durée journalière standard est dépassée</div>
                </div>

                <transition name="slide">
                    <div v-if="displayMoreInfosTiming">
                        <div class="border-top border-bottom border-warning py-2 my-2">
                            <div>Pause</div>
                            <div class="fs-5 fw-bold">1h00</div>
                            <div>12h<i class="bi bi-chevron-right"></i>13h</div>
                        </div>

                        <div>
                            <div>Amplitude</div>
                            <div class="fs-5 fw-bold">12h00</div>
                            <div>8h<i class="bi bi-chevron-right"></i>20h</div>
                            <div class="fs-8 fst-italic lh-sm">L'Amplitude journalière maximum est dépassée</div>
                        </div>
                    </div>
                </transition>
            </div>

            <button type="button" class="btn btn-warning w-100 rounded-0 d-flex justify-content-between align-items-center" @click.stop="displayMoreInfosTiming = !displayMoreInfosTiming">
                <i class="bi" :class="{'bi-chevron-double-up': displayMoreInfosTiming, 'bi-chevron-double-down': !displayMoreInfosTiming}"></i>                                     
                <div>détails</div>                                  
                <i class="bi" :class="{'bi-chevron-double-up': displayMoreInfosTiming, 'bi-chevron-double-down': !displayMoreInfosTiming}"></i>                                     
            </button>
        </div>

        <div class="card-body">
            <div class="mb-2">
                <div class="text-start border-top border-secondary">
                    <h3 class="fs-7 fw-bold">Justification</h3>

                    <div class="text-secondary text-center fst-italic">Une justification a donner</div>
                </div>
            </div>

            <div class="fw-bold cursor-pointer" @click.stop="displayMoreInfosReport = !displayMoreInfosReport">
                <div class="d-flex justify-content-between align-items-start border-top border-secondary">
                    <h3 class="fs-7 fw-bold">
                        6 infos
                    </h3>

                    <i class="bi" :class="{'bi-chevron-double-up': displayMoreInfosReport, 'bi-chevron-double-down': !displayMoreInfosReport}"></i>  
                </div>
            </div>

            <transition name="slide">
                    <ul class="px-0" v-if="displayMoreInfosReport">
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
            </transition>
        </div>
    </div>

</template>

<style lang="scss">
    .shadow-info {
        box-shadow: 0 0.5rem 1rem rgba(13, 202, 240, .15);
    }
    
    .square-color {
        color: rgba(13, 202, 240);
    }

    .slide-enter-active, 
    .slide-leave-active {
        transition: max-height 0.5s ease-in-out;
    }

    .slide-enter-to,
    .slide-leave-from {
        max-height: 200px;
        overflow: hidden;
    }

    .slide-enter-from,
    .slide-leave-to {
        overflow: hidden;
        max-height: 0px;
    }
</style>

<script>

export default {
    props: {
        pointage: Object
    },

    data() {
        return {
            displayMoreInfosTiming : false,
            displayMoreInfosReport : false,
            selected: false,
            validate: false
        }
    },

    methods: {
        selectedAction() {
            this.selected = !this.selected;

            let options = [this.pointage];

            console.log(this.pointage);

            if(this.selected) {
                options.push('add');
            } else {
                options.push('remove');
            }

            console.log('OPTIONS §§§§§ ', options);

            this.$emit('selected-pointage', options)


        }
    },
}
</script>