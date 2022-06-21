<template>
        <div class="">
            <div class="d-flex justify-content-between align-items-center fw-bold mb-2">
                <span class="card-title m-0 fs-5">6 juin<i class="bi bi-chevron-right"></i>12 juin 2022</span>
                <span>S{{nbSemaine}}</span>
            </div>

            <span class="fst-italic">12 Pointages</span>

            <ProgressBar :two-color="true" progress-color="success" rest-color="warning" progress-value="60"></ProgressBar>
            <ProgressBar  rest-color="warning"></ProgressBar>
        </div>
</template>

<script>
import ProgressBar from '@/components/pebble-ui/ProgressBar.vue';

export default {
    props: {
        nbSemaine: Number,
    },

    components: {
        ProgressBar
    }
}
</script>