requirejs.config({
  baseUrl: 'js/lib'
});

requirejs(['gui'], (gui) => {
  gui.UIInit();
});
