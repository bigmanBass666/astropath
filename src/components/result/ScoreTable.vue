<template>
  <section class="score-table">
    <div class="score-table__header">
      <h2 class="score-table__title">
        评分详情
      </h2>
      <div class="score-table__sort">
        <button
          class="score-table__sort-btn"
          :class="{ 'is-active': sortBy === 'rank' }"
          @click="sortBy = 'rank'"
        >
          按排名
        </button>
        <button
          class="score-table__sort-btn"
          :class="{ 'is-active': sortBy === 'id' }"
          @click="sortBy = 'id'"
        >
          按序号
        </button>
      </div>
    </div>

    <div class="score-table__wrapper">
      <table class="score-table__table">
        <thead>
          <tr>
            <th>排名</th>
            <th>序号</th>
            <th>队伍</th>
            <th>评分一</th>
            <th>评分二</th>
            <th>评分三</th>
            <th>评分四</th>
            <th>总分</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="score in sortedScores"
            :key="score.id"
            :class="{ 'is-our-team': score.isOurTeam }"
          >
            <td class="score-table__rank">
              {{ score.rank }}
            </td>
            <td class="score-table__id">
              {{ score.id }}
            </td>
            <td class="score-table__team">
              {{ score.teamNameAbbr }}
            </td>
            <td
              v-for="(s, idx) in score.scores"
              :key="idx"
              class="score-table__score"
            >
              {{ s ?? '-' }}
            </td>
            <td class="score-table__total">
              {{ score.totalScore || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="score-table__note">
      高亮行为智途 AstroPath 团队（LJX WYL）
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { competitionScores } from '@/data/competition-scores'

const sortBy = ref<'rank' | 'id'>('rank')

const sortedScores = computed(() => {
  const sorted = [...competitionScores]
  if (sortBy.value === 'rank') {
    sorted.sort((a, b) => {
      if (a.rank === b.rank) return a.id - b.id
      return a.rank - b.rank
    })
  } else {
    sorted.sort((a, b) => a.id - b.id)
  }
  return sorted
})
</script>

<style scoped>
.score-table {
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.score-table__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.score-table__title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #F8FAFC;
  letter-spacing: -0.02em;
}

.score-table__sort {
  display: flex;
  gap: 0.5rem;
}

.score-table__sort-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-family: var(--font-family-mono);
  color: rgba(248, 250, 252, 0.6);
  background: rgba(248, 250, 252, 0.05);
  border: 1px solid rgba(248, 250, 252, 0.1);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.score-table__sort-btn:hover {
  background: rgba(248, 250, 252, 0.1);
  color: #F8FAFC;
}

.score-table__sort-btn.is-active {
  background: #D97706;
  border-color: #D97706;
  color: #0F172A;
}

.score-table__wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid rgba(248, 250, 252, 0.1);
  background: rgba(248, 250, 252, 0.02);
}

.score-table__table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-family-mono);
  font-size: 0.875rem;
}

.score-table__table th {
  padding: 1rem 0.75rem;
  text-align: center;
  font-weight: 600;
  color: rgba(248, 250, 252, 0.5);
  background: rgba(248, 250, 252, 0.05);
  border-bottom: 1px solid rgba(248, 250, 252, 0.1);
  white-space: nowrap;
}

.score-table__table td {
  padding: 0.875rem 0.75rem;
  text-align: center;
  color: rgba(248, 250, 252, 0.8);
  border-bottom: 1px solid rgba(248, 250, 252, 0.05);
}

.score-table__table tbody tr {
  transition: background 0.2s ease;
}

.score-table__table tbody tr:hover {
  background: rgba(248, 250, 252, 0.03);
}

.score-table__table tbody tr.is-our-team {
  background: rgba(217, 119, 6, 0.15);
}

.score-table__table tbody tr.is-our-team:hover {
  background: rgba(217, 119, 6, 0.2);
}

.score-table__rank {
  font-weight: 700;
  color: #D97706 !important;
}

.score-table__id {
  color: rgba(248, 250, 252, 0.4) !important;
}

.score-table__team {
  text-align: left !important;
  font-weight: 500;
  color: #F8FAFC !important;
}

.score-table__score {
  color: rgba(248, 250, 252, 0.7) !important;
}

.score-table__total {
  font-weight: 700;
  color: #F8FAFC !important;
}

.score-table__note {
  margin: 1.5rem 0 0;
  font-size: 0.8125rem;
  font-family: var(--font-family-mono);
  color: rgba(248, 250, 252, 0.4);
  text-align: center;
}

@media (max-width: 768px) {
  .score-table {
    padding: 4rem 1rem;
  }
  .score-table__table {
    font-size: 0.75rem;
  }
  .score-table__table th,
  .score-table__table td {
    padding: 0.625rem 0.5rem;
  }
}
</style>
