let firaCode = new FontFace("firaCode", "url(resources/FiraCode-Regular.ttf)", {
    weight: "1000",
});

firaCode.load().then((font) => {
    document.fonts.add(font);
});
