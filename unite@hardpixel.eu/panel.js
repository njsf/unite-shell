const St        = imports.gi.St;
const GObject   = imports.gi.GObject;
const Clutter   = imports.gi.Clutter;
const Main      = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

var DesktopLabel = new GObject.Class({
  Name: 'Unite.DesktopLabel',
  GTypeName: 'UniteDesktopLabel',
  Extends: PanelMenu.Button,

  _init(params = { text: 'Desktop' }) {
    this.params  = params;
    this.appMenu = Main.panel.statusArea.appMenu;

    this.parent(0.0, 'DesktopLabel');

    this._label = new St.Label({ y_align: Clutter.ActorAlign.CENTER });
    this.actor.add_actor(this._label);

    this.actor.reactive = false;
    this.actor.label_actor = this._label;

    this.setText(params.text);
  },

  setText(text) {
    this._label.set_text(text);
  },

  setVisible(visible) {
    this.actor.visible = visible;
    this.appMenu.container.visible = !visible;
  }
});

var TrayIndicator = new GObject.Class({
  Name: 'Unite.TrayIndicator',
  GTypeName: 'UniteTrayIndicator',
  Extends: PanelMenu.Button,

  _init(params = { size: 20 }) {
    this._icons = [];
    this.params = params;

    this.parent(0.0, 'TrayIndicator');

    this._indicators = new St.BoxLayout({ style_class: 'panel-status-indicators-box' });
    this.actor.add_child(this._indicators);

    this._sync();
  },

  _sync() {
    this.actor.visible = this._icons.length;
  },

  addIcon(icon) {
    this._icons.push(icon);

    const mask = St.ButtonMask.ONE | St.ButtonMask.TWO | St.ButtonMask.THREE;
    const ibtn = new St.Button({ child: icon, button_mask: mask });

    this._indicators.add_child(ibtn);

    icon.connect('destroy', () => { ibtn.destroy() });
    ibtn.connect('button-release-event', (actor, event) => { icon.click(event) });

    icon.set_reactive(true);
    icon.set_size(this.params.size, this.params.size);

    this._sync();
  },

  removeIcon(icon) {
    const actor = icon.get_parent() || icon;
    actor.destroy();

    const index = this._icons.indexOf(icon);
    this._icons.splice(index, 1);

    this._sync();
  },

  forEach(callback) {
    this._icons.forEach(icon => { callback.call(null, icon) });
  }
});