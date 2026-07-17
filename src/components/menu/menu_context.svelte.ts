export class MenuContext {
    public activeMenu: string = $state('');

    public closeMenu() {
        this.activeMenu = '';
    }

    constructor() {}
}

export const menuContext = new MenuContext();
