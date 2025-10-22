// source: https://www.joshwcomeau.com/react/rainbow-button/

const rainbowColors = [
    'hsl(212deg 32% 8%)',
    'hsl(251deg 41% 24%)',
    'hsl(288deg 51% 40%)',
    'hsl(326deg 61% 56%)',
    'hsl(337deg 61% 56%)',
    'hsl(348deg 61% 56%)',
    'hsl(358deg 61% 56%)',
    'hsl(348deg 61% 56%)',
    'hsl(337deg 61% 56%)',
    'hsl(326deg 61% 56%)',
    'hsl(288deg 51% 40%)',
    'hsl(251deg 41% 24%)',
    'hsl(212deg 32% 8%)'
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

  let buttonElems = document.querySelectorAll('.magic-button');

  let cycleIndex = 0;

window.setInterval(() => {
  // Shift every color up by one position.
  //
  // `% paletteSize` is a handy trick to ensure
  // that values "wrap around"; if we've exceeded
  // the number of items in the array, it loops
  // back to 0.
  //
  //
  if (buttonElems.length === 0) {
    buttonElems = document.querySelectorAll('.magic-button');
    return;
  }

  buttonElems.forEach((b,index) => {
    const nextColors = [
      rainbowColors[(cycleIndex + 1 + index) % paletteSize],
      rainbowColors[(cycleIndex + 2 + index) % paletteSize],
      rainbowColors[(cycleIndex + 3 + index) % paletteSize],
    ];



    // Apply these new colors, update the DOM.
    colorNames.forEach((name, index) => {
      b.style.setProperty(name, nextColors[index]);
    });

    // increment the cycle count, so that we advance
    // the colors in the next loop.
    cycleIndex++;
  })
  }, intervalDelay);
