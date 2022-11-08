<template>
    
    <div class="d-flex my-2">
        <i class="bi bi-chat-left-text fs-6 text-secondary"></i>
        <div class="ms-2">
            <div><strong class="fs-7 text-secondary">{{from}}</strong></div>
            <div><em><slot></slot></em></div>
        </div>
    </div>

</template>

<script>

export default {

    props: {
        from: String
    }

}
</script>