import axios from "axios";


export class UserService {
	private apiUrl: string;

	constructor(api: string) {
		this.apiUrl = api;
	}


	async getUsers() {
		return axios.request({
			baseURL: this.apiUrl,
			headers: {Accept: 'application/json'},
			method: 'GET',
			url: '/users',
		})
	}

	async getFiltersConfig() {
		return axios.request({
			baseURL: this.apiUrl,
			headers: {Accept: 'application/json'},
			method: 'GET',
			url: '/filters/getFiltersConfig',
		})
	}
}