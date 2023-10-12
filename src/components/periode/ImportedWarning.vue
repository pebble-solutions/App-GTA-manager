<template>
    <div class="text-bg-warning card-body py-1">
        <i class="bi bi-sign-merge-left-fill"></i>
        Importé

        <div v-if="showDetails" class="fs-8">
            Les informations de cette période de pointage ont été importées et ne sont ni validées, ni refusées.
            Elle peuvent nécessiter une vérification approfondie.
        </div>
    </div>
</template>

<script>

export default {
    props: {
        showDetails: {
            type: Boolean,
            default: false
        }
    }
}
</script>