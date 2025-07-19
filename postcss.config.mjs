const config = {
  plugins: ["@tailwindcss/postcss"],
};

if (process.env.NODE_ENV === "production") {
  // Add cssnano for CSS minification in production builds
  config.plugins.push([
    "cssnano",
    {
      preset: "default",
    },
  ]);
}

export default config;
