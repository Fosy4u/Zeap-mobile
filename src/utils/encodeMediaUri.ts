const encodeMediaUri = (url?: string): string => {
    if (!url) return "";

    return url
        .trim()
        .replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
        .replace(/[^A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]/gu, (char) => encodeURIComponent(char));
};

export default encodeMediaUri;
