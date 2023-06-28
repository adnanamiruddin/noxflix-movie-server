const baseUrl = process.env.TMDB_BASE_URL;
const key = process.env.TMDB_KEY;

const getUrl = (endpoint, params) => {
  const qs = new URLSearchParams(params);
  // return `${baseUrl}${endpoint}?api_key=${key}&${qs}`;
  return `${baseUrl}${endpoint}?api_key=${key}&${qs}&region=ID`;
  // language=id-ID&page=1&region=ID
};

export default { getUrl };
