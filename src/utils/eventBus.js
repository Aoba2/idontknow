import mitt from 'mitt';
import { reactive } from 'vue';

const emitter = mitt(); 

const eventBus = reactive({
  emitter, 

  $on(event, callback) {
    this.emitter.on(event, callback);
  },
  $emit(event, data) {
    this.emitter.emit(event, data);
  },
  $off(event, callback) {
    this.emitter.off(event, callback);
  },

  $off(event) {
    this.emitter.off(event)
  }
});

export default eventBus;