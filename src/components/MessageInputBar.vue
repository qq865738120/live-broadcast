<template>
  <div class="root">
    <Group class="group">
      <XInput class="input" title=""  :show-clear="false"></XInput>
    </Group>
    <div class="bottom">
      <XButton class="button" mini :gradients="['#AFA79F', '#AFA79F']">取消</XButton>
      <XButton class="button" mini :gradients="['#ED7E00', '#ED7E00']">确定</XButton>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$('.weui-cells').css('margin-top', '0');
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/style/common.scss';

.root {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.group {
  width: calc(100% - 28px);
  padding: 14px 14px 0 14px;
}
.input {
  background-color: $--color-F5;
}
.bottom {
  margin: 0 14px 14px 14px;
}
</style>
