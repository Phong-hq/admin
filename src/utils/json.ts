export const isJsonString = (str: string) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export const tryParseJson = (data: any) => {
    try {
        const result = JSON.parse(data);
        return result;
    } catch (e) {
        return data;
    }
};
