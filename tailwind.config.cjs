const colors = require('./src/brand.json').colors;
// console.log(colors);

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Assistant', 'Helvetica', 'Arial', 'Lucida', 'sans-serif'],
				display: ['National', '"Open Sans"', 'Helvetica', 'Arial', 'Lucida', 'sans-serif']
			},
			colors
		}
	},

	plugins: [require('@tailwindcss/forms')]
};
