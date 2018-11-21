import mapboxgl from "mapbox-gl";

// We have to import js-cookies this way because they need better support for
// es6 module import: https://github.com/js-cookie/js-cookie/issues/233
window.Cookies = require("js-cookie");

import { setTooltip, showTooltip } from "./tooltip_utils.js";

window.ATD_TUTORIAL = {};

export function initializeTutorial(mapObject) {
  if (!window.Cookies.get("tutorialed")) {
    setTutorialStep1();
    setTutorialStep2(mapObject);
  }
}

export function initializeTutorialContinued(mapObject) {
  window.ATD_TUTORIAL.popupStep2.remove();

  setTutorialStep3(mapObject);
  setTutorialStep4();
}

function setTutorialStep1() {
  setTooltip(".mapbox-gl-draw_point", "right", "Click here to begin");
  showTooltip(".mapbox-gl-draw_point");
}

function setTutorialStep2(mapObject) {
  const MAP_CENTER = mapObject.mapOptions.center;

  $(".mapbox-gl-draw_point").on("click.tutorial", () => {
    $(".mapbox-gl-draw_point").tooltip("hide");

    window.ATD_TUTORIAL.popupStep2 = new mapboxgl.Popup()
      .setLngLat(MAP_CENTER)
      .setText(
        "Click any spot on the map to see where dockless trips started/ended"
      )
      .addTo(mapObject.map);
  });
}

function setTutorialStep3(mapObject) {
  const UTEXAS_LATLONG = [-97.734785, 30.284145];
  window.ATD_TUTORIAL.popupStep3 = new mapboxgl.Popup()
    .setLngLat(UTEXAS_LATLONG)
    .setText(
      "Click a hexagon to view how many trips started/ended at that location"
    )
    .addTo(mapObject.map);
}

function setTutorialStep4() {
  $("#map-container").on("click.step4", () => {
    window.ATD_TUTORIAL.popupStep3.remove();
    const BOOTSTRAP_SM_BREAKPOINT = 575;
    const step4Text = "Adjust more settings here";

    if (window.innerWidth < BOOTSTRAP_SM_BREAKPOINT) {
      setTooltip(".js-open-pane", "bottom", step4Text);
      showTooltip(".js-open-pane");

      $(".js-open-pane").on("click.settingsClose", () => {
        $(".js-open-pane").tooltip("hide");
        $(".js-open-pane").off("click.settingsClose");
      });
    } else {
      setTooltip(".js-flow-select", "top", step4Text);
      showTooltip(".js-flow-select");
      $(".js-flow-select").on("click.removeStep4", () => {
        $(".js-flow-select").tooltip("hide");
        $(".js-flow-select").off("click.removeStep4");
      });
    }

    $("#map-container").off("click.step4");
  });

  window.Cookies.set("tutorialed", true);
}