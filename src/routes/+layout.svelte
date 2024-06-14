<script lang="ts">
  import { page } from "$app/stores";
    import "bootstrap-icons/font/bootstrap-icons.css"
</script>

<main>
    <header>
        {#if $page.url.pathname != "/"}
            <a href="/"><i class="bi bi-arrow-left"></i> ホームに戻る</a>
        {:else}
            <span>ToolBox</span>
        {/if}
    </header>

    <div>
        <slot></slot>
    </div>

    <footer>
        <p>©{new Date().getFullYear()} ap12 | Created by ap12</p>
    </footer>
</main>

<style>
    footer {
        text-align: center;
        margin-top: auto;
        background-color: #111;
    }
    header a {
        color: #fff;
        text-decoration: none;
    }
    header {
        border-bottom: 1px solid #000;
        padding: 5px 20px;
    }
    main {
        display: flex;
        height: 100vh;
        flex-direction: column;
    }
</style>