<script lang="ts">
    import Icon from '@iconify/svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        show?: boolean;
        title?: string;
        children?: Snippet;
        closeable?: boolean;
    }

    let element: HTMLDialogElement;

    let { show = $bindable(false), title = '', children, closeable = true }: Props = $props();

    $effect(() => {
        show ? element.showModal() : element.close();
    });
</script>

<dialog bind:this={element}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="bg"
        onclick={() => {
            if (closeable) show = false;
        }}
    ></div>
    <div class="content">
        <div class="close-btn">
            <span>{title}</span>
            <button aria-label="閉じる" onclick={() => (show = false)}>
                <Icon icon="material-symbols:close" class="icon" inline />
            </button>
        </div>
        <hr />
        <div class="content-inner">
            {@render children?.()}
        </div>
    </div>
</dialog>

<style>
    dialog {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 0;
        margin: 0;
        height: 100%;
        background-color: transparent;
    }
    .bg {
        background-color: #000d;
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
    .content {
        display: flex;
        margin: 20px;
        padding: 5px;
        background-color: #222;
        color: #fff;
        border-radius: 5px;
        border: 1px #999 solid;
        flex-direction: column;
    }
    .content-inner {
        padding: 0 20px;
    }
    .close-btn {
        display: flex;
        margin: 0 10px;
        margin-top: 5px;
    }
    .close-btn button {
        cursor: pointer;
        background: none;
        margin-left: auto;
        color: #fff;
        border: none;
        padding: 0;
    }
    hr {
        margin: 10px 0;
    }
</style>
