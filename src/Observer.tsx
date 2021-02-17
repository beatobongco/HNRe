/**
 * The Observer module allows us to fire a callback whenever an element scrolls into view.
 * It works by maintaining a global IntersectionObserver instance attached to the viewport
 * and a map of all ids to callback functions.
 *
 * It is useful for lazy loading elements as they appear into view.
 */
const obsCallbackMap = new Map<string, Function>();
const observerSettings = {
  root: null, // defaults to viewport
  rootMargin: "0px 0px 0px 0px",
  threshold: 0,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // fire that specific entry's callback
      if (obsCallbackMap.has(entry.target.id)) {
        const callback = obsCallbackMap.get(entry.target.id) as Function;
        callback();
      }
      observer.unobserve(entry.target);
    }
  });
}, observerSettings);

const fireWhenVisible = (el: Element, id: string, callback: Function) => {
  observer.observe(el);
  obsCallbackMap.set(id, callback);
};

export { fireWhenVisible };
