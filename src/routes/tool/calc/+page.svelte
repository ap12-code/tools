<script lang="ts">
    import { onMount } from 'svelte';
    import Button from '$components/Button.svelte';
    import Container from '$components/Container.svelte';
    import nerdamer from 'nerdamer-prime';
    import 'katex/dist/katex.css';
    import _ from 'lodash';

    let expr = $state('');
    let output = $state('');
    let err = false;

    function equal() {
        try {
            output = nerdamer(expr + output)
                .evaluate()
                .toDecimal();
            expr = '';
        } catch (e: any) {
            output = 'ERR';
            expr = '';
            err = true;
        }
    }
    function op(btn: string) {
        output = expr + output;
        output = output.replace(/^(.+)[\+\-\*\/]$/, '$1');
        output += btn;
        [expr, output] = [output, '0'];
    }

    function handleClick(btn: string) {
        switch (btn) {
            case 'sin':
                output = `sin(${output})`;
                break;
            case 'cos':
                output = `cos(${output})`;
                break;
            case 'tan':
                output = `tan(${output})`;
                break;
            case 'sqrt':
                output = `sqrt(${output})`;
                break;
            case 'C':
                output = '0';
                err = false;
                break;
            case 'CA':
                output = '0';
                expr = '';
                err = false;
                break;
            case '*-1':
                if (err) break;
                output = (parseInt(output) * -1).toString();
                break;
            case '=':
                if (err) break;
                if (!output) break;
                equal();
                break;
            case 'BS':
                if (err) break;
                if (output == '0' && expr) {
                    [expr, output] = ['', expr.substring(0, expr.length - 1)];
                } else {
                    if (output.endsWith(')')) {
                        output = output.replace(/(sin|cos|tan|sqrt)\((.+)\)/, '$2');
                    } else {
                        output = output.substring(0, output.length - 1);
                        output = parseInt(output || '0').toString();
                    }
                }
                break;
            default:
                if (err) break;
                if (output == '0') output = '';
                if (/[0-9]/.test(btn) || btn == '.') {
                    output += btn;
                } else {
                    op(btn);
                }
        }
    }

    function handleKey(ev: KeyboardEvent) {
        ev.preventDefault();
        if (/^[\+\-\*\/0-9\.]$/.test(ev.key)) {
            handleClick(ev.key);
        }
        if (ev.key == 'Escape') {
            if (output == '0') {
                handleClick('CA');
            } else {
                handleClick('C');
            }
        }
        if (ev.key == 'Enter') {
            handleClick('=');
        }
        if (ev.key == 'Backspace') {
            handleClick('BS');
        }
    }

    function view(input: string): string {
        return input.replace('*', '×').replace('/', '÷');
    }

    onMount(() => handleClick('0'));
</script>

<svelte:body onkeydown={handleKey} />

<Container>
    <h1>電卓</h1>
    <p>キーボード操作に対応してます</p>
    <hr />
    <section>
        <div class="result">
            <span class="expr">{view(expr)}</span>
            <span class="out">{view(output)}</span>
        </div>

        <div class="buttons">
            <Button onclick={() => handleClick('7')}>7</Button>
            <Button onclick={() => handleClick('8')}>8</Button>
            <Button onclick={() => handleClick('9')}>9</Button>
            <Button onclick={() => handleClick('/')}>/</Button>

            <Button onclick={() => handleClick('4')}>4</Button>
            <Button onclick={() => handleClick('5')}>5</Button>
            <Button onclick={() => handleClick('6')}>6</Button>
            <Button onclick={() => handleClick('*')}>*</Button>

            <Button onclick={() => handleClick('1')}>1</Button>
            <Button onclick={() => handleClick('2')}>2</Button>
            <Button onclick={() => handleClick('3')}>3</Button>
            <Button onclick={() => handleClick('-')}>-</Button>

            <Button onclick={() => handleClick('.')}>.</Button>
            <Button onclick={() => handleClick('0')}>0</Button>
            <Button onclick={() => handleClick('*-1')}>+/-</Button>
            <Button onclick={() => handleClick('+')}>+</Button>

            <Button onclick={() => handleClick('CA')}>CA</Button>
            <Button onclick={() => handleClick('C')}>C</Button>
            <Button onclick={() => handleClick('=')}>=</Button>
            <Button onclick={() => handleClick('BS')}><i class="bi bi-backspace-fill"></i></Button>
            <Button onclick={() => handleClick('sin')}>sin</Button>
            <Button onclick={() => handleClick('cos')}>cos</Button>
            <Button onclick={() => handleClick('tan')}>tan</Button>
            <Button onclick={() => handleClick('sqrt')}>√</Button>
        </div>
    </section>
</Container>

<style>
    .result {
        text-align: right;
        padding: 5px;
        margin: 20px 0;
        background-color: #111;
        border-radius: 5px;
        height: 45px;
    }
    .result span {
        font-family: 'Noto Sans Mono';
    }
    .out {
        font-size: 20px;
        display: block;
        min-height: 25px;
    }
    .expr {
        font-size: 12px;
        display: block;
        min-height: 17px;
    }
    .buttons {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
    }
    .buttons :global(.button-component) {
        padding: 10px;
    }
</style>
