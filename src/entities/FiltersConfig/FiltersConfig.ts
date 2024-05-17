import {Nullish} from "../../shared";

export type FieldType =
	| "singleSelect"
	| "infiniteSingleSelect"
	| "multiSelect"
	| "infiniteMultiSelect"
	| "range"
	| "date";

export interface FilterFieldListItem {
	elementId: string;
	value: string;
	name: string;
}

export interface FilterFieldList {
	values: Array<FilterFieldListItem>;
	count: number;
	currentPage: number;
	pagesCount: number;
}

export interface FilterConfig {
	type: FieldType;
	title: string;
	defaultValues: Nullish<[string, string]>;
	list: Nullish<Array<FilterFieldList>>;
}

export type FiltersConfigCollection = Array<FilterConfig>;
