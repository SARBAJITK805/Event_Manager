class ApiResponse{
    constructor(
        statusCode,data,message="Success",success
    ){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode<400;
    }
}

module.export = ApiResponse;