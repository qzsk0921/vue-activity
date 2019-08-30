<template>
  <div class="full-screen">
    <div class="loading">
      <div class="bgl"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "loading",
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped rel="stylesheet">
.full-screen {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    // .jump {
    //   width: 100px!important;
    //   height: 100px!important;
    //   z-index: 10;
    //   animation: jump .8s ease-in infinite;
    // }
    .bgl {
      width: 84px !important;
      height: 84px !important;
      background: url("~@/assets/images/load.png") no-repeat 0 0;
      animation: mymovie 4s steps(39, end) infinite;
    }
    @keyframes mymovie {
      0% {
        // transform: translateY(0);
        background-position-y: 0;
      }
      100% {
        // transform: translateY(-3276px);
        background-position-y: -3276px;
      }
    }
  }
}
</style>


