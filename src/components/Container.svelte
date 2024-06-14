<div>
    <slot></slot>
</div>

<style>
div {
    margin: 20px 100px;
}
@media (max-width: 1025px) {
    div {
        margin: 10px 15px;
    }
}
@media (max-width: 720px) {
    div {
        margin: 10px 5px;
    }
}
</style>
