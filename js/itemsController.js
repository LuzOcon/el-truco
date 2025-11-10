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


// Auto-scroll
const gallery = document.querySelector('.gallery-scroll');
if (gallery) {
    let scrollAmount = 0;
    const scrollSpeed = 1; 
    const scrollInterval = 30; 
    
    function autoScroll() {
        if (!gallery.matches(':hover')) {
            scrollAmount += scrollSpeed;
            gallery.scrollLeft = scrollAmount;
            // Reinicia cuando llega al final
            if (scrollAmount >= gallery.scrollWidth - gallery.clientWidth) {
                scrollAmount = 0;
            }
        }
    }
    
    setInterval(autoScroll, scrollInterval);
}
