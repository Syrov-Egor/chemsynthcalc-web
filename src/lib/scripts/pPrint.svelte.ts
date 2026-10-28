export function prettyPrint(obj: any, prefix = ""): string {
    if (obj == null) return "null";
    if (typeof obj !== "object") return String(obj);

    let str = "";
    const indent = prefix + "  ";

    if (Array.isArray(obj)) {
        str += "[\n";
        for (let i = 0; i < obj.length; i++) {
            str +=
                indent +
                prettyPrint(obj[i], indent) +
                (i < obj.length - 1 ? "," : "") +
                "\n";
        }
        str += prefix + "]";
    } else {
        str += "{\n";
        for (const [key, value] of Object.entries(obj)) {
            str += indent + `${key}: ${prettyPrint(value, indent)},\n`;
        }
        str += prefix + "}";
    }
    return str;
}