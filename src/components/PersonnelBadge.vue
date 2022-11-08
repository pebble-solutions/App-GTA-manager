<template>
    <div class="d-flex align-items-center justify-content-start my-1">
        <div class="me-2"><UserImage :name="personnel.cache_nom"></UserImage></div>
        <strong class="text-secondary">{{personnel.cache_nom}}</strong>
    </div>
</template>

<script>
import UserImage from '@/components/pebble-ui/UserImage.vue';

export default {
    props: {
        personnel: Object,
    },
    
    components: {
        UserImage
    },
}
</script>