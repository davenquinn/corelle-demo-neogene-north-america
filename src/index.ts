import "regenerator-runtime";
import h from "@macrostrat/hyper";
import { render } from "react-dom";
import { App } from "./app";

const el = document.getElementById("root");
render(h(App), el);
