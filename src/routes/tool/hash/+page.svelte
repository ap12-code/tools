<script lang="ts">
    import Container from '$components/Container.svelte';
    import Text from '$components/form/Text.svelte';
    import Tabs from '$components/tab/Tabs.svelte';
    import FileUpload from '$components/FileUpload.svelte';

    import { sha512, sha384 } from 'js-sha512';
    import { sha256, sha224 } from 'js-sha256';
    import { sha1 } from 'js-sha1';

    import { md5 } from 'js-md5';

    let files: FileSystemFileHandle[] = $state([]);

    let data: Uint8Array | string = $state('');

    let s_sha512 = $state('');
    let s_sha384 = $state('');
    let s_sha256 = $state('');
    let s_sha224 = $state('');
    let s_sha1 = $state('');

    let s_md5 = $state('');

    function update() {
        s_sha512 = '';
        s_sha384 = '';
        s_sha224 = '';
        s_sha256 = '';
        s_sha1 = '';
        s_md5 = '';

        if (data != '') {
            s_sha512 = sha512(data);
            s_sha384 = sha384(data);
            s_sha256 = sha256(data);
            s_sha224 = sha224(data);
            s_sha1 = sha1(data);

            s_md5 = md5(data);
        }
    }

    async function updateFile() {
        data = await (await files[0].getFile()).bytes();
    }
</script>

<Container>
    <h1>ハッシュ変換</h1>
    <hr />
    <div class="input">
        <p>入力</p>
        <Tabs tabs={['テキスト', 'ファイル']}>
            {#snippet tab({ name }: { name: string })}
                {#if name == 'テキスト'}
                    <Text bind:value={data} height="200px" oninput={update} multiline></Text>
                {:else if name == 'ファイル'}
                    <FileUpload {files} onchange={updateFile}></FileUpload>
                {/if}
            {/snippet}
        </Tabs>
        <div class="spacer"></div>
        <hr />
        <p>出力</p>
        <div>
            <Text read_only copyable label="MD5" value={s_md5}></Text>
            <br />
            <Text read_only copyable label="SHA1" value={s_sha1}></Text>
            <Text read_only copyable label="SHA224" value={s_sha224}></Text>
            <Text read_only copyable label="SHA256" value={s_sha256}></Text>
            <Text read_only copyable label="SHA384" multiline value={s_sha384}></Text>
            <Text read_only copyable label="SHA512" multiline value={s_sha512}></Text>
        </div>
    </div>
</Container>

<style>
    .spacer {
        height: 20px;
    }
</style>
