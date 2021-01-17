import axios from "axios";

export default axios.create({
    baseURL: 'https://react-quiz-e93a8-default-rtdb.firebaseio.com/'
})