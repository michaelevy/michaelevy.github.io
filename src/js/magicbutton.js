// source: https://www.joshwcomeau.com/react/rainbow-button/

const rainbowColors = [
    'hsl(270deg, 100%, 40%)',
    'hsl(280deg, 100%, 35%)',
    'hsl(300deg, 100%, 25%)',
    'hsl(230deg, 100%, 35%)',
    'hsl(240deg, 100%, 45%)',
    'hsl(260deg, 100%, 55%)'
  ];
  const paletteSize = rainbowColors.length;
  
  // Number of milliseconds for each update
  const intervalDelay = 1000;
  
  const colorNames = [
    '--magic-rainbow-color-0',
    '--magic-rainbow-color-1',
    '--magic-rainbow-color-2',
  ];

  
  // Register properties
  colorNames.forEach((name, index) => {
    CSS.registerProperty({
      name,
      syntax: '<color>',
      inherits: false,
      initialValue: rainbowColors[index],
    });
  });
  
  let buttonElem = document.querySelector('.magic-button');
  
  let cycleIndex = 0;
  
  window.setInterval(() => {
    // Shift every color up by one position.
    //
    // `% paletteSize` is a handy trick to ensure
    // that values "wrap around"; if we've exceeded
    // the number of items in the array, it loops
    // back to 0.
    const nextColors = [
      rainbowColors[(cycleIndex + 1) % paletteSize],
      rainbowColors[(cycleIndex + 2) % paletteSize],
      rainbowColors[(cycleIndex + 3) % paletteSize],
    ];

    if(!buttonElem) {
        buttonElem = document.querySelector('.magic-button');
        return;
    }

    console.log(buttonElem)
  
    // Apply these new colors, update the DOM.
    colorNames.forEach((name, index) => {
      buttonElem.style.setProperty(name, nextColors[index]);
    });
  
    // increment the cycle count, so that we advance
    // the colors in the next loop.
    cycleIndex++;
  }, intervalDelay);