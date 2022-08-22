<template>
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
</template>


<script>
export default {
    props: {
        periode: Object,
        selected: Boolean
    }
}
</script>