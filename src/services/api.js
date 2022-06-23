import axiox from "axios";

const { REACT_APP_CHALLENGE_URL } = process.env;

const api = axiox.create({
  baseURL: REACT_APP_CHALLENGE_URL,
})

export default api
