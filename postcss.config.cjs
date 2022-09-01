const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const nesting = require('@tailwindcss/nesting');
const PostCSSImport = require('postcss-import');

const config = {
	plugins: [
		//Some plugins, like tailwindcss/nesting, need to run before Tailwind,
		PostCSSImport(),
		nesting(),
		tailwindcss(),
		//But others, like autoprefixer, need to run after,
		autoprefixer
	]
};

module.exports = config;
