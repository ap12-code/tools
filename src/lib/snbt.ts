export const SNBT = {
    stringify: (val: Record<string, any>): string => {
        const datas = [];
        for (let k of Object.keys(val)) {
            if (!val[k]) continue;
            datas.push(`${k}:${val[k]}`);
        }
        return `{${datas.join(',')}}`;
    }
};
