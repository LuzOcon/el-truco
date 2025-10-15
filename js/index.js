const controller = new ItemsController();

controller.addItem(
  "Tayto",
  "Cheese & Onion Chips",
  "https://www.irishtimes.com/polopoly_fs/1.4078148!/image/image.jpg",
  "2020-09-20"
);

controller.addItem(
  "Water",
  "Mineral water",
  "http://www.mazalv.com/wp-content/uploads/2016/11/Bottled-Water1-979x1024-1-979x1024.png",
  "2020-09-20"
);

// Mostrar en pantalla
controller.renderItems();
