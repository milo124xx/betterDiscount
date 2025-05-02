<template>
    <header class="header-nav">
        <div class="container">
            <div class="nav-content">
                <div class="logo cursor-pointer" @click="goHome">
                    <SiteLogo />
                </div>
                <div class="search-box">
                    <q-input v-model="searchText" dense outlined placeholder="搜索优惠商品" class="search-input"
                        @keyup.enter="handleSearch">
                        <template v-slot:append>
                            <q-btn flat round icon="search" color="primary" @click="handleSearch" />
                        </template>
                    </q-input>
                </div>
                <div class="nav-actions">
                    <q-btn v-if="!isHomePage" flat color="primary" icon="home" label="返回首页" @click="goHome"
                        class="back-home-btn" />
                    <q-btn v-if="isAdmin" flat color="negative" icon="logout" label="退出登录" @click="handleLogout" />
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SiteLogo from './SiteLogo.vue'

defineOptions({
  name: 'HeaderNavComponent'
})

const route = useRoute()
const router = useRouter()
const searchText = ref('')

// 计算当前是否在首页
const isHomePage = computed(() => route.path === '/')
// 计算当前是否是管理员
const isAdmin = computed(() => route.path === '/admin')

// 处理搜索
function handleSearch() {
    if (searchText.value.trim()) {
        router.push({
            path: '/search',
            query: { q: searchText.value.trim() }
        })
        // 清空搜索框
        searchText.value = ''
    }
}

// 退出登录
function handleLogout() {
    localStorage.removeItem('isAdmin')
    router.push('/')
}

// 返回首页
function goHome() {
    router.push('/')
}
</script>

<style lang="scss" scoped>
.header-nav {
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    position: sticky;
    top: 0;
    z-index: 100;

    .container {
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
    }

    .nav-content {
        display: flex;
        align-items: center;
        padding: 16px 0;
        height: 72px;

        .logo {
            width: 200px;
            flex-shrink: 0;
        }

        .search-box {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 500px;

            .search-input {
                width: 100%;
            }
        }

        .nav-actions {
            margin-left: auto;
            display: flex;
            gap: 12px;
        }
    }
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}
</style>
