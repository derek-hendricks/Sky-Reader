export const hexToHSL = hex => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    let HSL = {};
    HSL["h"] = h;
    HSL["s"] = s;
    HSL["l"] = l;
    return HSL;
  };


const wordArrayWithHSLGradients = (
    wordArray,
    hsl,
    hsl2,
    increment,
    linePart,
    isOdd
  ) => {
    const [hslValues1, hslValues2] = isOdd ? [hsl2, hsl] : [hsl, hsl2];

    const hue = hslValues1[0];
    const saturation = hslValues1[1];
    const lightness = hslValues1[2];
    const otherHue = hslValues2[0];
    const otherSaturation = hslValues2[1];
    const otherLightness = hslValues2[2];

    return wordArray.slice(0).map((word, index) => {
      if (index === 0) {
        return {
          word,
          hsl: hslValues1
        };
      }
      const hueValue =
        hue > otherHue
          ? hue - index * increment.hue
          : hue + index * increment.hue;

      const saturationValue =
        saturation > otherSaturation
          ? saturation - index * increment.saturation
          : saturation + index * increment.saturation;

      const lightnessValue =
        lightness > otherLightness
          ? lightness - index * increment.lightness
          : lightness + index * increment.lightness;

      return {
        word,
        hsl: [hueValue, saturationValue, lightnessValue]
      };
    });
  };

  export const setLineArrayWithHslValues = (
    lineArray,
    lineFormatNumber,
    lineGradientHslValue
  ) => {
    const selectedLineGradient = lineGradientHslValue;
    const hsl1 = selectedLineGradient.first;
    const hsl2 = selectedLineGradient.second;

    const hslHuePercentageDiffValue = Math.abs(hsl1[0] - hsl2[0]);
    const hslSaturationPercentageDiffValue = Math.abs(hsl1[1] - hsl2[1]);
    const hslLightnessPercentageDiffValue = Math.abs(hsl1[2] - hsl2[2]);

    const wordCount = lineArray.length;

    const hslIncrement = {
      hue: hslHuePercentageDiffValue / wordCount,
      saturation: hslSaturationPercentageDiffValue / wordCount,
      lightness: hslLightnessPercentageDiffValue / wordCount
    };

    const gradientsPerLine = Math.floor(wordCount / 2);

    const wordArray = lineArray.slice();
    let wordArray1 = wordArray.splice(0, gradientsPerLine);
    let wordArray2 = wordArray;

    const isOdd = lineFormatNumber % 2 === 0;

    const hslWordArray1 = wordArrayWithHSLGradients(
      wordArray1.slice(0),
      hsl1,
      hsl2,
      hslIncrement,
      1,
      isOdd
    );
    const hslWordArray2 = wordArrayWithHSLGradients(
      wordArray2.slice(0).reverse(),
      hsl2,
      hsl1,
      hslIncrement,
      2,
      isOdd
    );

    return [...hslWordArray1, ...hslWordArray2.reverse()];
  };
