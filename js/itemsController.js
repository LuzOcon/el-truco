class ItemsController {
  constructor(currentId = 0) {
    this.items = [];
    this.currentId = currentId;
  }
  
  addItem(name, category, image, description, ingredients, steps) {
    this.currentId++;
    const item = { id: this.currentId, name, category, image, description, ingredients, steps };
    this.items.push(item);
  }
}
