let firaCode = new FontFace("firaCode", "url(/resources/FiraCode-Regular.ttf)", {
    weight: "1000",
});

let mondiaThin = new FontFace("mondiaThin", "url(/resources/MondiaThin.otf)", {
    weight: "1000",
});

firaCode.load().then((font) => {
    document.fonts.add(font);
});

mondiaThin.load().then((font) => {
    document.fonts.add(font);
});

