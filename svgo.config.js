export default {
  multipass: true,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          convertPathData: {
            floatPrecision: 2,
            forceAbsolutePath: false,
            utilizeAbsolute: false,
          },
          removeViewBox: false,
        },
      },
    },
    "removeDimensions",
    {
      name: "removeAttrs",
      params: {
        attrs: "(fill)",
      },
    },
    {
      name: "addAttributesToSVGElement",
      params: {
        attributes: [{ fill: "currentColor" }],
      },
    },
  ],
};
