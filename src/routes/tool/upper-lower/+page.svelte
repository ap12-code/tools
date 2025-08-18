<script>
    import Container from '$components/Container.svelte';

    let lowerCase = $state('');
    let upperCase = $state('');

    function updateLower() {
        lowerCase = lowerCase.toLowerCase();
        upperCase = lowerCase.toUpperCase();
    }
    function updateUpper() {
        upperCase = upperCase.toUpperCase();
        lowerCase = upperCase.toLowerCase();
    }
</script>

<Container>
    <h1>大文字 / 小文字 変換ツール</h1>
    <hr />
    <div class="main">
        <div>
            <p>小文字</p>
            <textarea bind:value={lowerCase} oninput={updateLower}></textarea>
        </div>
        <div>
            <p>大文字</p>
            <textarea bind:value={upperCase} oninput={updateUpper}></textarea>
        </div>
    </div>
</Container>

<style>
    .main {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    textarea {
        padding: 5px;
        background-color: #222;
        resize: none;
        width: 100%;
        border-radius: 5px;
        color: #fff;
        height: 20vh;
    }
    hr {
        margin: 20px 0;
        border-color: #666;
    }
</style>
