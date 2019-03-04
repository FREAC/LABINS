  require([
      "esri/Map", "esri/views/MapView", "esri/layers/GraphicsLayer", "esri/core/watchUtils",
      "dojo/dom", "dojo/ready"
  ], function (Map, MapView, GraphicsLayer, watchUtils, dom, ready) {

      // Graphics layer that will highlight features accessed through zoomTo Functions
      selectionLayer = new GraphicsLayer({
          listMode: "hide"
      });

      bufferLayer = new GraphicsLayer({
          listMode: "hide"
      });
      /* code goes here */

      // // Create another Map, to be used in the overview "view"
      overviewMap = new Map({
          basemap: "topo"
      });

      map = new Map({
          basemap: "topo",
          // layers: [countyBoundariesLayer, labinsLayer, swfwmdLayer, CCCLLayer, townshipRangeSectionLayer, selectionLayer, bufferLayer]
          layers: [selectionLayer, bufferLayer]
      });

      //Overview Mapview
      // Create the MapView for overview map
      overView = new MapView({
          container: "overviewDiv",
          map: overviewMap,
          constraints: {
              rotationEnabled: false
          }
      });

      mapView = new MapView({
          container: "mapViewDiv",
          map: map,
          padding: {
              top: 50,
              bottom: 0
          },
          center: [-82.28, 27.8],
          zoom: 7,
          constraints: {
              rotationEnabled: false
          }
      });

      overView.ui.components = [];

      extentDiv = dom.byId("extentDiv");

      overView.when(function () {
          // Update the overview extent whenever the MapView or SceneView extent changes
          mapView.watch("extent", updateOverviewExtent);
          overView.watch("extent", updateOverviewExtent);

          // Update the minimap overview when the main view becomes stationary
          watchUtils.when(mapView, "stationary", updateOverview);

          function updateOverview() {
              // Animate the MapView to a zoomed-out scale so we get a nice overview.
              // We use the "progress" callback of the goTo promise to update
              // the overview extent while animating
              overView.goTo({
                  center: mapView.center,
                  scale: mapView.scale * 2 * Math.max(mapView.width /
                      overView.width,
                      mapView.height / overView.height)
              });
          }

          function updateOverviewExtent() {
              // Update the overview extent by converting the SceneView extent to the
              // MapView screen coordinates and updating the extentDiv position.
              var extent = mapView.extent;

              var bottomLeft = overView.toScreen(extent.xmin, extent.ymin);
              var topRight = overView.toScreen(extent.xmax, extent.ymax);

              extentDiv.style.top = topRight.y + "px";
              extentDiv.style.left = bottomLeft.x + "px";

              extentDiv.style.height = (bottomLeft.y - topRight.y) + "px";
              extentDiv.style.width = (topRight.x - bottomLeft.x) + "px";
          }
      });

  });