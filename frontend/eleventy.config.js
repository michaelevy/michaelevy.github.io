import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";

export default function (eleventyConfig) {
  // Copy all static assets from public/
  eleventyConfig.addPassthroughCopy("public");
  
  // Copy CSS and JS
  eleventyConfig.addPassthroughCopy("src/**/*.css");
  eleventyConfig.addPassthroughCopy("src/**/*.js");

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

  // Set input/output directories to remove src/pages from URLs
  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["html", "liquid", "md"],
    pathPrefix: "/"
  };
}
