"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const mithril_1 = __importDefault(require("mithril"));
const levels_1 = __importDefault(require("./lib/levels"));
const Practice_1 = __importDefault(require("./components/Practice"));
var level = levels_1.default.find(l => l.id === 'updown');
mithril_1.default.mount(document.getElementById('app'), {
    view() {
        return mithril_1.default(Practice_1.default, { level: level });
    }
});
