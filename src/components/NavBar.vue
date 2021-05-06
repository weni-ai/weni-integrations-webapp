<template>
  <div id="topnav">
    <router-link to="discovery">Discovery</router-link>
    <router-link to="apps">My Apps</router-link>
  </div>
</template>
<script>
export default {
  name: 'NavBar',
};
</script>
<style scoped>
#topnav {
  display: inline-flex;
  flex-wrap: wrap;
  margin: -64px 0 0 -64px;
  width: calc(100% + 64px);
  justify-content: center;
}

#topnav > * {
  margin: 64px 0 0 64px;
}
</style>
