class APIHandler {
  constructor(baseUrl) {
    this.BASE_URL = baseUrl;
    this.api = axios.create({ baseURL: this.BASE_URL });
  }

  createOneTag(label) {
    return this.api.post("/api/tag", {
      label
    });
  }
}
