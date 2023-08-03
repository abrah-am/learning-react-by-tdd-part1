export const fetchResponseOk = (body) => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body)
});

export const fetchResponseError = (status = 500, body = {}) => ({
    ok: false,
    status,
    json: () => Promise.resolve(body)
});