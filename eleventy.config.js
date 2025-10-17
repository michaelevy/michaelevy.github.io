export default function (eleventyConfig) {
	// Find and copy any `jpg` files, maintaining directory structure.
	eleventyConfig.addPassthroughCopy("**/*.css");
	eleventyConfig.addPassthroughCopy("**/*.js");
	eleventyConfig.addPassthroughCopy("**/*.png");
	eleventyConfig.addPassthroughCopy("**/*.svg");
	eleventyConfig.addPassthroughCopy("**/*.otf");
	eleventyConfig.addPassthroughCopy("**/*.ttf");
	eleventyConfig.addPassthroughCopy("**/*.jpg");
};