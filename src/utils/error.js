export const formatGraphQLError = (e) => {
    if (!e) return "";
    if (e.message) return e.message;
    if (e.networkError && e.networkError.message) return e.networkError.message;
    if (e.graphQLErrors && e.graphQLErrors.length) return e.graphQLErrors.map((g) => g.message).join("; ");
    try { return JSON.stringify(e); } catch { return "Unknown error"; }
};