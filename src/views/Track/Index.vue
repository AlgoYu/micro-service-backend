<template>
  <el-card class="box-card" style="height:100%;width:100%" body-style="height:100%">
        <iframe
            :src="apiUrl + '/zipkin/'"
            frameborder="0"
            scrolling="no"
            width="100%"
            height="100%"
        ></iframe>
    </el-card>
</template>

<script>
export default {

}
</script>

<style>

</style>