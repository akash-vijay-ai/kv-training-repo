import { CustomError } from "../utils/error.code";
import HttpException from "./http.excption";

class EntityNotFoundException extends HttpException {
    constructor(error: CustomError) {
        super(404, error.MESSAGE);
    }
}

export default EntityNotFoundException;
