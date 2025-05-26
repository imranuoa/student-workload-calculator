import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		alias: {
			'@': './src'
		},
		paths: {
			// base: process.env.BASE_URL || ''
			base: process.env.NODE_ENV === 'production' ? '/student-workload-calculator' : '/student-workload-calculator'
		}
	}
};
export default config;


