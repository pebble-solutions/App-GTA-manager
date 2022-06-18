<template>
    <div class="card">
        <div class="card-body text-dark">
            <div class="d-flex justify-content-between align-items-center fw-bold">
                <span class="card-title m-0 fs-5">6 juin<i class="bi bi-chevron-right"></i>12 juin 2022</span>
                <span>S{{nbSemaine}}</span>
            </div>

            <span class="fst-italic">12 Pointages</span>
            
            <div class="progress ">
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    props: {
        nbSemaine: Number
    }
}
</script>