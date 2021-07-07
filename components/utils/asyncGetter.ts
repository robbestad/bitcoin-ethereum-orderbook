const asyncGetter = (url: string, timeout = 2000) => () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(url);
        }, timeout);
    });
};
export default asyncGetter;
