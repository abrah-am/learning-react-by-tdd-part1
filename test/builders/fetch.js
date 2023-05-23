export const fetchResponseOK = (body) => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(body)
});

export const fetchResponseError = () => Promise.resolve({ ok: false });