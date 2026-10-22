<script lang="ts">
    import Prism from 'prismjs';
    import 'prismjs/themes/prism-dark.css';

    import 'prismjs/components/prism-json';

    import 'prismjs/plugins/line-numbers/prism-line-numbers';
    import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

    interface Props {
        content: string;
        language: string;
    }

    let { content = $bindable(), language }: Props = $props();
</script>

<pre>{@html Prism.highlight(content, Prism.languages[language], language)}</pre>

<style>
    pre {
        display: block;
        background-color: #111;
        padding: 10px;
        border-radius: 5px;
        height: 200px;
        overflow-y: scroll;
        font-family: monospace;
        white-space: break-spaces;
    }
</style>
