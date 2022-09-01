import type { componentInstance } from '$lib/components';

export interface courseMeta {
    name: string;
    weeks: number;
}

export interface course {
    openComponent: number;
    meta: courseMeta;
    components: componentInstance[];
}