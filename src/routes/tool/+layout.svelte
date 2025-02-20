<script lang="ts">
    import Container from "$components/Container.svelte";
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>

<Container>
    {@render children?.()}
</Container>
