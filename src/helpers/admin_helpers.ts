export const buttonClass = (btn: string, mode: string) =>
    btn === mode ? "btn-secondary" : "btn-outline-secondary";

export const disabled = (val: any) => val == "ID" ? "disabled" : "";

export const selected = (val1: any, val2: any) => val1 == val2 ? "selected" : "";