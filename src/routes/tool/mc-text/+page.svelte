<script lang="ts">
    import Button from '$components/Button.svelte';
    import Container from '$components/Container.svelte';
    import Text from '$components/form/Text.svelte';
    import McText from '$components/MCText.svelte';
    import type { TextData } from '$lib/minecraft/types';

    let data: TextData = $state('');
    let value: string = $state('');

    function onInput() {
        data = JSON.parse(value);
    }

    function update() {
        value = JSON.stringify(data);
    }
</script>

<Container>
    <h1>テキストジェネレーター</h1>
    <hr />
    <McText bind:data {update}></McText>
    <Text copyable={true} read_only={true} bind:value oninput={onInput}></Text>
    <Text copyable={true} read_only={true} value={`/tellraw @s ` + JSON.stringify(data)}></Text>
    <Text copyable={true} read_only={true} value={`/title @s title ` + JSON.stringify(data)}></Text>
</Container>
