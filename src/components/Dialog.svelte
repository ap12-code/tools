<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        show?: boolean;
        title?: string;
        children?: Snippet;
    }

    let element: HTMLDialogElement;

    let { show = $bindable(false), title = '', children }: Props = $props();

    $effect(() => {
        show ? element.showModal() : element.close();
    });
</script>

<dialog bind:this={element}>
    <div class="main">
        <div class="bg"></div>
        <div class="content">
            <div class="close-btn">
                <span>{title}</span>
                <button aria-label="閉じる" onclick={() => (show = false)}>
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <hr />
            <div class="content-inner">
                {@render children?.()}
            </div>
        </div>
    </div>
</dialog>

<style>
    .bg {
        background-color: #000d;
        position: fixed;
        display: block;
        width: 100%;
        height: 100%;
    }
    .main {
        width: 100%;
    }
    .content {
        display: flex;
        justify-content: center;
        position: absolute;
        margin: 20px;
        padding: 5px;
        background-color: #222;
        border-radius: 5px;
        border: 1px #999 solid;
        flex-direction: column;
    }
    .content-inner {
        padding: 0 20px;
    }
    .close-btn {
        display: flex;
    }
    .close-btn button {
        margin-left: auto;
        text-align: end;
        background: none;
        appearance: none;
        color: #fff;
        border: none;
        cursor: pointer;
    }
    hr {
        margin: 10px 0;
    }
</style>
