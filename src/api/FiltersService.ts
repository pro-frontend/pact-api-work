import axios from 'axios';

export class FiltersService {
  private apiUrl: string;

  constructor(api: string) {
    this.apiUrl = api;
  }

  async getFiltersConfig() {
    return await axios.request({
      baseURL: this.apiUrl,
      headers: { Accept: 'application/json' },
      method: 'GET',
      url: '/filters/getFiltersConfig',
    });
  }
}