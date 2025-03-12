export class Loader {
  static show(element) {
    element.classList.add("loading");
    element.setAttribute("aria-busy", "true");
  }

  static hide(element) {
    element.classList.remove("loading");
    element.setAttribute("aria-busy", "false");
  }
}
