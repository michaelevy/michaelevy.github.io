import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("**/*.css");
  eleventyConfig.addPassthroughCopy("**/favicon.png");
  eleventyConfig.addPassthroughCopy("**/*.js");
  eleventyConfig.addPassthroughCopy("**/*.ttf");
  eleventyConfig.addPassthroughCopy("**/*.otf");
  eleventyConfig.addPassthroughCopy("**/*.woff2");
  eleventyConfig.addPassthroughCopy("**/leaf.svg");

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  // Create a collection of published lab experiments
  eleventyConfig.addCollection("publishedExperiments", function(collectionApi) {
    return collectionApi.getFilteredByTag("labExperiment")
      .filter(item => {
        // Exclude the main lab.html page itself
        if (item.fileSlug === "lab") return false;
        // Only include non-draft experiments
        return !item.data.draft;
      })
      .sort((a, b) => {
        // Sort by order field if it exists, otherwise by date
        return (a.data.order || 999) - (b.data.order || 999);
      });
  });
}
