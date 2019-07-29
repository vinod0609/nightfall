export default class Response {
  set statusCode(code) {
    this._statusCode = code;
  }

  set data(responseData) {
    this._data = responseData;
  }

  toJSON() {
    return { 
      statusCode: this._statusCode,
      data: this._data,
    };
  }
}
