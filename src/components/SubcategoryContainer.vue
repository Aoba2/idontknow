<template>
 <div class="subcategory-container" v-if="isNarrowScreen">
  <div class="title-category-container">
  <h6 class="category-title">{{ categoryList.title }}</h6>
 </div>
  <ul v-for="categoryItem in categoryList.list" :key="categoryItem.id">
   <a :href="categoryItem.linkTo">
   <li >
     {{ categoryItem.name }} 
   </li>
  </a>
  </ul>
 </div>
<div v-else>
      <el-menu
        active-text-color="#FFF"
        background-color="#071D41"
        class="mobi-category-menu"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1" style="width: 100%;">
          <template #title>
            <span>{{ categoryList.title }}</span>
          </template>
          <el-menu-item-group v-for="categoryItem in categoryList.list" :key="categoryItem.id">
            <el-menu-item @click="redirectTo(categoryItem.linkTo)">{{ categoryItem.name }} </el-menu-item>
           </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

defineProps({
  categoryList: {
    type: Object,
    required: true
  }
});

const windowWidth = ref(window.innerWidth);

const isNarrowScreen = computed(() => {
  return windowWidth.value >= 1265
})

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowWidth);
});

const redirectTo = (link) => {
  window.location.href = link; 
}

</script>

<style scoped>

.mobi-category-menu {
  display: flex;
  flex-direction: row;
}

.subcategory-container {
 display: flex;
 flex-direction: column;

 ul {
  display: flex;
  flex-direction: column;
  gap: 20px;

  li {
   padding: 20px 30px;
   color: rgb(172, 172, 172);

  }

  a { 
   text-decoration: none;
   color: #fff;
  }

 }
}

.title-category-container {
 display: flex;
 align-items: start;
 padding: 20px 30px;
}

.category-title {
  display: flex;
  justify-content: start;
 text-transform: uppercase;
 font-size: 13px;
}

.subcategory-container li:hover, .title-category-container:hover {
 background-color: rgba(65, 84, 116, 0.3)
}
</style>