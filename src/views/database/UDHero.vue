<template>
  <section
    ref="heroRef"
    class="ud-hero"
    :class="{ 'ud-hero--visible': heroVisible }"
  >
    <div class="ud-hero__grid-bg" />
    <div class="ud-hero__glow" />
    <div class="ud-hero__inner">
      <div class="ud-hero__label">
        <span class="ud-hero__label-dot" />
        <span>UNIVERSITY DATABASE</span>
      </div>
      <h1
        ref="heroTitleRef"
        class="ud-hero__title"
      >
        <span
          v-for="(word, i) in heroWords"
          :key="i"
          class="ud-hero__word"
          :style="{ '--word-i': i }"
        >
          <span class="ud-hero__word-inner">{{ word }}</span>
        </span>
      </h1>
      <p class="ud-hero__sub">
        AI 智能解析背景，为你生成专属留学路线图
      </p>
      <div
        class="ud-search"
        :class="{ 'ud-search--focus': searchFocused }"
        @keyup.enter="$emit('search')"
      >
        <div class="ud-search__icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          ><circle
            cx="8.5"
            cy="8.5"
            r="6"
            stroke="currentColor"
            stroke-width="1.5"
          /><path
            d="M13 13L17 17"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          /></svg>
        </div>
        <input
          :model-value="heroSearchKeyword"
          type="text"
          class="ud-search__field"
          placeholder="搜索院校名称、专业或国家..."
          @focus="$emit('update:searchFocused', true)"
          @blur="$emit('update:searchFocused', false)"
          @input="$emit('update:heroSearchKeyword', ($event.target as HTMLInputElement).value)"
        >
        <button
          class="ud-search__btn"
          @click="$emit('search')"
        >
          <span>搜索</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          ><path
            d="M3 7H11M8 4L11 7L8 10"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          /></svg>
        </button>
      </div>
      <div class="ud-hero__tags">
        <span
          v-for="tag in hotTags"
          :key="tag"
          class="ud-tag"
          @click="$emit('searchTag', tag)"
        >{{ tag }}</span>
      </div>
      <div class="ud-hero__stats">
        <div
          v-for="(stat, i) in heroStats"
          :key="i"
          class="ud-stat"
        >
          <span class="ud-stat__num">{{ stat.value }}</span>
          <span class="ud-stat__lbl">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  heroVisible: boolean
  searchFocused: boolean
  heroSearchKeyword: string
  heroWords: string[]
  hotTags: string[]
  heroStats: { value: string; label: string }[]
}>()

defineEmits<{
  search: []
  'update:searchFocused': [value: boolean]
  'update:heroSearchKeyword': [value: string]
  searchTag: [tag: string]
}>()
</script>
