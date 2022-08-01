<template>
    <td :rowspan="rowspan">
        <UserImage :name="personnel.cache_nom" size="user-image-lg" class-name="my-1"></UserImage>
        <div>{{personnel.cache_nom}}</div>
    </td>
</template>

<script>
import UserImage from '@/components/pebble-ui/UserImage.vue';

export default {
    props: {
        rowspan: Number,
        personnel: Object,
    },
    
    components: {
        UserImage
    },
}
</script>