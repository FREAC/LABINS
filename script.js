require([
  // ArcGIS
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/MapImageLayer",
  "esri/layers/FeatureLayer",
  "esri/tasks/QueryTask",
  "esri/tasks/support/Query",
  "esri/request",
  "esri/geometry/geometryEngine",
  "esri/geometry/Extent",
  "esri/geometry/Point",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/tasks/IdentifyTask",
  "esri/tasks/support/IdentifyParameters",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/renderers/SimpleRenderer",
  "esri/tasks/Locator",
  "esri/tasks/GeometryService",
  "esri/geometry/support/webMercatorUtils",
  "esri/tasks/support/BufferParameters",
  "esri/geometry/SpatialReference",

  // Widgets
  "esri/widgets/CoordinateConversion",
  "esri/widgets/CoordinateConversion/support/Format",
  "esri/widgets/CoordinateConversion/support/Conversion",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Search",
  "esri/widgets/Legend",
  "esri/widgets/LayerList",
  "esri/widgets/Print",
  "esri/widgets/BasemapToggle",
  "esri/widgets/ScaleBar",
  "esri/widgets/Home",
  "esri/widgets/Locate",
  "esri/core/watchUtils",
  "dojo/_base/array",
  "dojo/Deferred",
  "dojo/on",
  "dojo/dom",
  "dojo/dom-class",
  "dojo/promise/all",
  "dojo/dom-construct",
  "dojo/dom-geometry",
  "dojo/keys",
  "dojo/json",
  "dojo/_base/lang",
  "dojo/query",
  "dojo/_base/Color",


  // Bootstrap
  "bootstrap/Collapse",
  "bootstrap/Dropdown",

  // Calcite Maps
  "calcite-maps/calcitemaps-v0.6",
  // Calcite Maps ArcGIS Support
  "calcite-maps/calcitemaps-arcgis-support-v0.6",

  "dojo/domReady!"
], function (
  Map,
  MapView,
  MapImageLayer,
  FeatureLayer,
  QueryTask,
  Query,
  esriRequest,
  geometryEngine,
  Extent,
  Point,
  GraphicsLayer,
  Graphic,
  IdentifyTask,
  IdentifyParameters,
  SimpleFillSymbol,
  SimpleLineSymbol,
  SimpleRenderer,
  Locator,
  GeometryService,
  webMercatorUtils,
  BufferParameters,
  SpatialReference,
  CoordinateConversion,
  Format,
  Conversion,
  Basemaps,
  Search,
  Legend,
  LayerList,
  Print,
  BasemapToggle,
  ScaleBar,
  Home,
  Locate,
  watchUtils, arrayUtils, Deferred, on, dom, domClass, all, domConstruct, domGeom, keys, JSON, lang, query, Color,
  Collapse,
  Dropdown,
  CalciteMaps,
  CalciteMapsArcGISSupport) {

  var minimumDrawScale = 100000;
  var extents = [];

  var controlPointsURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/Control_Points_3857/MapServer/";
  var controlPointsLayer = new MapImageLayer({
    url: controlPointsURL,
    title: "LABINS Data",
    minScale: minimumDrawScale,
    sublayers: [{
      id: 9,
      title: "Erosion Control Line",
      visible: true,
      //popupTemplate: erosionControlLineTemplate,
      popupEnabled: false
    }, {
      id: 8,
      title: "R-Monuments",
      visible: true,
      //popupTemplate: rMonumentsTemplate,
      popupEnabled: false
    }, {
      id: 7,
      title: "CCR with Images",
      visible: false,
      //popupTemplate: CCRTemplate,
      popupEnabled: false
    }, {
      id: 6,
      title: "Geographic Names",
      visible: false,
      //popupTemplate: geonamesTemplate,
      popupEnabled: false
    }, {
      id: 5,
      title: "Tide Interpolation Points",
      visible: true,
      //popupTemplate: tideInterpPointsTemplate
      popupEnabled: false
    }, {
      id: 4,
      title: "Tide Stations",
      visible: true,
      //popupTemplate: tideStationsTemplate
      popupEnabled: false
    }, {
      id: 3,
      title: "Certified Corner (BLMID) Labels",
      visible: false,
      popupEnabled: false
    }, {
      id: 2,
      title: "Certified Corners",
      visible: true,
      //popupTemplate: certifiedCornersTemplate,
      popupEnabled: false
    }, {
      id: 1,
      title: "Preliminary NGS Points",
      visible: false,
      //popupTemplate: NGSPreliminarypopupTemplate,
      popupEnabled: false
    }, {
      id: 0,
      title: "NGS Control Points",
      visible: true,
      //popupTemplate: NGSpopupTemplate,
      popupEnabled: false
    }]
  });

  var swfwmdURL = "https://www25.swfwmd.state.fl.us/arcgis12/rest/services/BaseVector/SurveyBM/MapServer/";
  // var swfwmdURL = "https://www25.swfwmd.state.fl.us/ArcGIS/rest/services/AGOServices/AGOSurveyBM/MapServer/"; //nonworking url
  var swfwmdLayer = new MapImageLayer({
    url: swfwmdURL,
    title: "SWFWMD Survey Benchmarks",
    minScale: minimumDrawScale,
    sublayers: [{
      id: 0,
      title: "Survey Benchmarks",
      visible: true,
      popupEnabled: false
    }]
  });

  var controlLinesURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/Control_Lines_3857/MapServer/";
  var controlLinesLayer = new MapImageLayer({
    url: controlLinesURL,
    title: "Other Base Layers",
    minScale: minimumDrawScale,
    sublayers: [{
      id: 9,
      title: "Soils June 2012 - Dept. of Agriculture",
      visible: false,
      //popupTemplate: soilsTemplate
      popupEnabled: false
    }, {
      id: 8,
      title: "Hi-Res Imagery Grid: State Plane East",
      visible: true,
      popupEnabled: false
    }, {
      id: 7,
      title: "Hi-Res Imagery Grid: State Plane North",
      visible: true,
      popupEnabled: false
    }, {
      id: 6,
      title: "Hi-Res Imagery Grid: State Plane West",
      visible: true,
      popupEnabled: false
    }, {
      id: 5,
      title: "Parcels",
      visible: false,
      //popupTemplate: parcelTemplate,
      popupEnabled: false
    }, {
      id: 4,
      title: "County Boundaries",
      visible: false,
      popupEnabled: false
    }, {
      id: 3,
      title: "City Limits",
      visible: false,
      //cityLimitsTemplate,
      popupEnabled: false,
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          style: "none",
          outline: {
            style: "dash",
            width: 1.25
          }
        }
      },
    }, {
      id: 2,
      title: "Township-Range-Section",
      visible: true,
      popupEnabled: false
    }, {
      id: 1,
      title: "Township-Range",
      visible: true,
      popupEnabled: false,
      labelsVisible: true,
      labelingInfo: [{
        //labelExpression: "[SUBSTRING(tr_dissolve, 0, 3)]",
        //labelExpression: "[" + 'SUBSTR("tr_dissolve" 0, 3)' + "]",
        labelExpression: "[tr_dissolve]",
        labelPlacement: "always-horizontal",
        symbol: {
          type: "text", // autocasts as new TextSymbol()
          color: [0, 0, 255, 1],
          haloColor: [255, 255, 255],
          haloSize: 2,
          font: {
            size: 11
          }
        }
      }]
    }, {
      id: 0,
      title: "USGS Quads",
      visible: false,
      popupEnabled: false
    }]
  });

  // Layers needed for dependent dropdowns
  var townshipRangeSectionURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/Control_Lines_3857/MapServer/2"
  var townshipRangeSectionLayer = new FeatureLayer({
    url: townshipRangeSectionURL,
    outFields: ["twn_ch", "rng_ch", "sec_ch"],
    title: "Section Lines",
    visible: false,
    listMode: "hide",
    popupEnabled: false
  });

  // Graphics layer that will highlight features accessed through zoomTo Functions
  var selectionLayer = new GraphicsLayer({
    listMode: "hide"
  });

  var bufferLayer = new GraphicsLayer({
    listMode: "hide"
  });

  // Symbol that will populate the graphics Layer
  var highlightSymbol = new SimpleFillSymbol(
    SimpleFillSymbol.STYLE_SOLID,
    new SimpleLineSymbol(
      SimpleLineSymbol.STYLE_SOLID,
      new Color([255, 0, 0]), 1),
    new Color([125, 125, 125, 0.35])
  );

  var highlightPoint = {
    type: "simple-marker",
    outline: {
      width: 1,
      color: [255, 0, 0, 1]
    },
    color: [173, 173, 173, 0.52]
  };

  var highlightLine = {
    type: "simple-line",
    width: 2,
    color: [255, 0, 0, 1]
  };



  var sectionSym = {
    type: "simple-fill",
    outline: {
      width: 1.5,
      color: [76, 230, 0, 1]
    },
    color: [0, 0, 0, 0]
  };

  /////////////////////
  // Create the map ///
  /////////////////////

  // Create another Map, to be used in the overview "view"
  var overviewMap = new Map({
    basemap: "topo"
  });

  var map = new Map({
    basemap: "topo",
    layers: [swfwmdLayer, controlLinesLayer, townshipRangeSectionLayer, selectionLayer, controlPointsLayer, bufferLayer]
  });

  /////////////////////////
  // Create the MapView ///
  /////////////////////////

  var mapView = new MapView({
    container: "mapViewDiv",
    map: map,
    padding: {
      top: 50,
      bottom: 0
    },
    center: [-82.28, 27.8],
    zoom: 13,
    constraints: {
      rotationEnabled: false
    }
  });


  //Overview Mapview
  // Create the MapView for overview map
  var overView = new MapView({
    container: "overviewDiv",
    map: overviewMap,
    constraints: {
      rotationEnabled: false
    }
  });

  overView.ui.components = [];

  var extentDiv = dom.byId("extentDiv");

  // Bookmark data objects
  var bookmarkJSON = {
    first: {
      "extent": {
        "xmin": -9382178.056935968,
        "ymin": 3559339.642506011,
        "xmax": -9381031.501511535,
        "ymax": 3559579.702548002,
        "spatialReference": {
          "wkid": 102100,
          "latestWkid": 3857
        }
      },
      "name": "Florida Prime Meridian"
    },
  };


  function initBookmarksWidget() {
    var bmDiv = dom.byId("bookmarksDiv");
    domClass.add(bmDiv, "bookmark-container");
    var bookmarksdiv = domConstruct.create("div", {
      class: "esriBookmarks"
    }, bmDiv);
    var bmlistdiv = domConstruct.create("div", {
      class: "esriBookmarkList",
      style: {
        width: '250px'
      }
    }, bookmarksdiv);
    var bmTable = domConstruct.create("div", {
      class: "esriBookmarkTable"
    }, bmlistdiv);
    var bmadditemdiv = domConstruct.create("div", {
      class: "esriBookmarkItem esriAddBookmark"
    }, bookmarksdiv);
    var addbmlabeldiv = domConstruct.create("div", {
      class: "esriBookmarkLabel",
      innerHTML: "Add Bookmark"
    }, bmadditemdiv);
    on(bmadditemdiv, "click", bookmarkEvent);
    on(bmadditemdiv, "mouseover", addMouseOverClass);
    on(bmadditemdiv, "mouseout", removeMouseOverClass);

    //process the bookmarkJSON
    Object.keys(bookmarkJSON).forEach(function (bookmark) {
      var bmName = bookmarkJSON[bookmark].name || "Bookmark " + (index + 1).toString();
      var theExtent = Extent.fromJSON(bookmarkJSON[bookmark].extent);
      var bmTable = query(".esriBookmarkTable")[0];
      var item = domConstruct.toDom('<div class="esriBookmarkItem" data-fromuser="false" data-extent="' + theExtent.xmin + ',' + theExtent.ymin + ',' + theExtent.xmax + ',' + theExtent.ymax + ',' + theExtent.spatialReference.wkid +
        '"><div class="esriBookmarkLabel">' + bmName + '</div><div title="Remove" class="esriBookmarkRemoveImage"></div><div title="Edit" class="esriBookmarkEditImage"></div></div>');
      domConstruct.place(item, bmTable, "last");
      on(query(".esriBookmarkRemoveImage", item)[0], "click", removeBookmark);
      on(query(".esriBookmarkEditImage", item)[0], "click", editBookmark);
      on(item, "click", bookmarkEvent);
      on(item, "mouseover", addMouseOverClass);
      on(item, "mouseout", removeMouseOverClass);
      bookmarkJSON[bookmark];
    });

    //process the local storage bookmarks
    readBookmarks();
  }

  initBookmarksWidget();

  function addMouseOverClass(evt) {
    evt.stopPropagation();
    domClass.add(evt.currentTarget, "esriBookmarkHighlight");
  }

  function removeMouseOverClass(evt) {
    evt.stopPropagation();
    domClass.remove(evt.currentTarget, "esriBookmarkHighlight");
  }

  function removeBookmark(evt) {
    evt.stopPropagation();
    var bmItem = evt.target.parentNode;

    var bmEditItem = query(".esriBookmarkEditBox")[0];
    if (bmEditItem) {
      domConstruct.destroy(bmEditItem);
    }
    domConstruct.destroy(bmItem);

    setTimeout(writeCurrentBookmarks, 200);
  }

  function writeCurrentBookmarks() {
    extents = [];
    var bmTable = query(".esriBookmarkTable")[0];
    var bookMarkItems = query(".esriBookmarkItem", bmTable);
    bookMarkItems.forEach(function (item) {
      if (item.dataset.fromuser) {
        var extArr = item.dataset.extent.split(",");
        var theExt = new Extent({
          xmin: extArr[0],
          ymin: extArr[1],
          xmax: extArr[2],
          ymax: extArr[3],
          spatialReference: {
            wkid: parseInt(extArr[4])
          }
        });
        var sExt = {
          extent: theExt,
          name: query(".esriBookmarkLabel", item)[0].innerHTML
        }
        extents.push(sExt);
      }
    });
    var stringifedExtents = JSON.stringify(extents);
    localStorage.setItem("myBookmarks", stringifedExtents);
  }

  function editBookmark(evt) {
    evt.stopPropagation();
    var bmItem = evt.target.parentNode;
    var bmItemName = query(".esriBookmarkLabel", bmItem)[0].innerHTML;
    var output = domGeom.position(bmItem, true);
    var editItem = domConstruct.toDom('<input class="esriBookmarkEditBox" style="top: ' + (output.y + 1) + 'px; left: ' + output.x + 'px;">');
    editItem.value = bmItemName;
    var bmTable = query(".esriBookmarkTable")[0];
    domConstruct.place(editItem, bmTable);
    on(editItem, "keypress", function (evt) {
      var charOrCode = evt.charCode || evt.keyCode
      if (charOrCode === keys.ENTER) {
        query(".esriBookmarkLabel", bmItem)[0].innerHTML = editItem.value;
        domConstruct.destroy(editItem);
        writeCurrentBookmarks();
      }
    });
    editItem.focus();
  }

  function bookmarkEvent(evt) {
    if (domClass.contains(evt.target, "esriAddBookmark")) {
      var bmTable = query(".esriBookmarkTable")[0];
      var item = domConstruct.toDom('<div class="esriBookmarkItem" data-fromuser="true" data-extent="' + mapView.extent.xmin + ',' + mapView.extent.ymin + ',' + mapView.extent.xmax + ',' + mapView.extent.ymax + ',' + mapView.extent.spatialReference.wkid +
        '"><div class="esriBookmarkLabel"></div><div title="Remove" class="esriBookmarkRemoveImage"></div><div title="Edit" class="esriBookmarkEditImage"></div></div>');

      domConstruct.place(item, bmTable, "last");
      var output = domGeom.position(item, true);
      var editItem = domConstruct.toDom('<input class="esriBookmarkEditBox" style="top: ' + (output.y + 1) + 'px; left: ' + output.x + 'px;">');
      domConstruct.place(editItem, bmTable);
      on(editItem, "keypress", function (evt) {
        var charOrCode = evt.charCode || evt.keyCode
        if (charOrCode === keys.ENTER) {
          query(".esriBookmarkLabel", item)[0].innerHTML = editItem.value;
          domConstruct.destroy(editItem);
          sExt = {
            name: editItem.value,
            extent: mapView.extent
          }
          extents.push(sExt);
          console.log(sExt);
          var stringifedExtents = JSON.stringify(extents);
          localStorage.setItem("myBookmarks", stringifedExtents);
        }
      });
      on(query(".esriBookmarkRemoveImage", item)[0], "click", removeBookmark);
      on(query(".esriBookmarkEditImage", item)[0], "click", editBookmark);
      on(item, "click", bookmarkEvent);
      on(item, "mouseover", addMouseOverClass);
      on(item, "mouseout", removeMouseOverClass);
      editItem.focus();
      return;
    }

    var extArr = evt.target.dataset.extent.split(",");
    mapView.goTo(new Extent({
      xmin: extArr[0],
      ymin: extArr[1],
      xmax: extArr[2],
      ymax: extArr[3],
      spatialReference: {
        wkid: parseInt(extArr[4])
      }
    }), {
      duration: 2000
    });
  }

  function readBookmarks() {
    try {
      if (!localStorage.getItem("myBookmarks")) {
        return;
      }
      var extentArray = JSON.parse(localStorage.getItem("myBookmarks"));
      if (!extentArray) {
        return;
      }
      extentArray.map(function (extentJSON, index) {
        var bmName = extentJSON.name || "Bookmark " + (index + 1).toString();
        var theExtent = Extent.fromJSON(extentJSON.extent);
        extents.push(extentJSON);
        var bmTable = query(".esriBookmarkTable")[0];
        var item = domConstruct.toDom('<div class="esriBookmarkItem" data-fromuser="true" data-extent="' + theExtent.xmin + ',' + theExtent.ymin + ',' + theExtent.xmax + ',' + theExtent.ymax + ',' + theExtent.spatialReference.wkid +
          '"><div class="esriBookmarkLabel">' + bmName + '</div><div title="Remove" class="esriBookmarkRemoveImage"></div><div title="Edit" class="esriBookmarkEditImage"></div></div>');
        domConstruct.place(item, bmTable, "last");
        on(query(".esriBookmarkRemoveImage", item)[0], "click", removeBookmark);
        on(query(".esriBookmarkEditImage", item)[0], "click", editBookmark);
        on(item, "click", bookmarkEvent);
        on(item, "mouseover", addMouseOverClass);
        on(item, "mouseout", removeMouseOverClass);
      })
    } catch (e) {
      console.warn("Could not parse bookmark JSON", e.message);
    }
  }

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

  // clears selectionLayer (general feature highlighting) and highlightFeaturesLayer (data query highlighting)
  function clearGraphics() {
    console.log("cleared graphics");
    map.graphics.clear();
    selectionLayer.graphics.removeAll();
    highlightFeaturesLayer.removeAll();
  }

  // reset dropdowns and all inputs that are not equal to the current element. 
  function resetElements(currentElement) {
    // if elements are not equal to the current element
    // then reset to the initial values

    // find all dropdowns
    $("select").each(function () {
        if ((this != currentElement) && (this != document.getElementById('selectLayerDropdown'))) {
          this.selectedIndex = 0
        }
      },
      // find all inputs
      $("input").each(function () {
        if (this != currentElement) {
          $(this).val('');
        }
      })
    );
  }




  /////////////////////////////
  /// Dropdown Select Panel ///
  /////////////////////////////

  // query layer and populate a dropdown
  function buildSelectPanel(url, attribute, zoomParam, panelParam) {

    var task = new QueryTask({
      url: url
    });

    var params = new Query({
      where: attribute + " IS NOT NULL",
      outFields: [attribute],
      returnDistinctValues: true,
    });

    var option = domConstruct.create("option");
    option.text = zoomParam;
    dom.byId(panelParam).add(option);

    task.execute(params)
      .then(function (response) {
        var features = response.features;
        var values = features.map(function (feature) {
          return feature.attributes[attribute];
        });
        return values;

      })
      .then(function (uniqueValues) {
        uniqueValues.sort();
        uniqueValues.forEach(function (value) {
          var option = domConstruct.create("option");
          option.text = value.toUpperCase();
          dom.byId(panelParam).add(option);
        });
      });
  }

  // Input location from drop down, zoom to it and highlight
  function zoomToFeature(panelurl, location, attribute) {

    //var multiPolygonGeometries = [];
    // union features so that they can be returned as a single geometry
    //var union = geometryEngine.union(multiPolygonGeometries);

    var task = new QueryTask({
      url: panelurl
    });
    var params = new Query({
      where: attribute + " = '" + location + "'",
      returnGeometry: true
    });
    task.execute(params)
      .then(function (response) {
        console.log(response);
        // Go to extent of features and highlight
        mapView.goTo(response.features);
        selectionLayer.graphics.removeAll();
        graphicArray = [];

        for (i = 0; i < response.features.length; i++) {
          highlightGraphic = new Graphic(response.features[i].geometry, highlightSymbol);
          graphicArray.push(highlightGraphic);
          //multiPolygonGeometries.push(response.features[i].geometry);
        }
        selectionLayer.graphics.addMany(graphicArray);
      });
    //return union;
  }

  // Union geometries of multi polygon features
  function unionGeometries(response) {
    // Array to store polygons in
    var multiPolygonGeometries = [];
    for (i = 0; i < response.features.length; i++) {
      multiPolygonGeometries.push(response.features[i].geometry);
    }
    var union = geometryEngine.union(multiPolygonGeometries);
    console.log('unioning of all pieces is complete', union);
    return union;
  }

  // // the identify function that happens when a section is chosen from the Zoom to Feature panel
  // function executeTRSIdentify(response) {
  //   console.log(response);

  //   identifyTask = new IdentifyTask(controlPointsURL);

  //   // Set the parameters for the Identify
  //   params = new IdentifyParameters();
  //   params.tolerance = 3;
  //   params.layerIds = [0, 2];
  //   params.layerOption = "all";
  //   params.width = mapView.width;
  //   params.height = mapView.height;

  //   // Set the geometry to the location of the view click
  //   params.geometry = response;
  //   params.mapExtent = mapView.extent;
  //   dom.byId("mapViewDiv").style.cursor = "wait";

  //   // This function returns a promise that resolves to an array of features
  //   // A custom popupTemplate is set for each feature based on the layer it
  //   // originates from
  //   identifyTask.execute(params).then(function(response) {
  //     var results = response.results;

  //     return [arrayUtils.map(results, function(result) {

  //       var feature = result.feature;
  //       var layerName = result.layerName;

  //       feature.attributes.layerName = layerName;
  //       if (layerName === 'Certified Corners') {
  //         feature.popupTemplate = CCRTemplate;
  //       } else if (layerName === 'NGS Control Points') {
  //         feature.popupTemplate = NGSIdentifyPopupTemplate;
  //       }
  //       //console.log(feature);
  //       return feature;
  //     }), params.geometry];
  //   }).then(showPopup); // Send the array of features to showPopup()

  //   // Shows the results of the Identify in a popup once the promise is resolved
  //   function showPopup(data) {
  //     response = data[0];
  //     geometry = data[1];

  //     if (response.length > 0) {
  //       mapView.popup.open({
  //         features: response,
  //         location: geometry.centroid
  //       });
  //     }
  //     dom.byId("mapViewDiv").style.cursor = "auto";
  //   }
  //   return identifyTask.execute(params);
  // } 

  // when a section feature is chose, a matching TRS combination is queried, highlighted and zoomed to
  function zoomToSectionFeature(panelurl, location, attribute) {


    var township = document.getElementById("selectTownship");
    var strUser = township.options[township.selectedIndex].text;

    var range = document.getElementById("selectRange");
    var rangeUser = range.options[range.selectedIndex].text;

    var section = document.getElementById("selectSection");
    var sectionUser = section.options[section.selectedIndex].text;


    var task = new QueryTask({
      url: panelurl
    });
    var params = new Query({
      where: "twn_ch = '" + strUser.substr(0, 2) + "' AND tdir = '" + strUser.substr(2) + "' AND rng_ch = '" + rangeUser.substr(0, 2) + "' AND rdir = '" + rangeUser.substr(2) + "' AND sec_ch = '" + sectionUser + "'",
      returnGeometry: true
    });
    task.execute(params)
      .then(function (response) {
        console.log(response);
        var multiPolygonGeometries = [];
        for (i = 0; i < response.features.length; i++) {
          multiPolygonGeometries.push(response.features[i].geometry);
        }
        var union = geometryEngine.union(multiPolygonGeometries);
        console.log(union);
        var ext = union.extent;
        var cloneExt = ext.clone();
        mapView.goTo({
          target: union,
          extent: cloneExt.expand(1.75)
        });
        return union;
      })
      .then(createBuffer)
    // for now (6/4/2018) lets dont do the identify on the final zoom
    // part of the problem is the visibility option does not work, it just identifies on ALL layers
    // the getVisibleLayerIds works, but right now it only executes when the page loads, so that is a
    // problem when other layers are turned on the getVisible is not reloaded.
    //
    //.then(executeTRSIdentify)
    //.then(executeIdentifyTask)
    //.then(togglePanel);
  }

  // Modified zoomToFeature function to zoom once the Township and Range has been chosen
  function zoomToTRFeature(panelurl, location, attribute) {
    multiPolygonGeometries = [];
    var union = geometryEngine.union(multiPolygonGeometries);

    var township = document.getElementById("selectTownship");
    var strUser = township.options[township.selectedIndex].text;

    var range = document.getElementById("selectRange");
    var rangeUser = range.options[range.selectedIndex].text;


    var task = new QueryTask({
      url: panelurl
    });
    var params = new Query({
      where: "twn_ch = '" + strUser.substr(0, 2) + "' AND tdir = '" + strUser.substr(2) + "' AND rng_ch = '" + rangeUser.substr(0, 2) + "' AND rdir = '" + rangeUser.substr(2) + "'",
      returnGeometry: true
    });
    task.execute(params)
      .then(function (response) {
        console.log('here is what we found with this query', response);
        mapView.goTo(response.features);
        selectionLayer.graphics.removeAll();
        bufferLayer.graphics.removeAll();
        graphicArray = [];
        for (i = 0; i < response.features.length; i++) {
          highlightGraphic = new Graphic(response.features[i].geometry, highlightSymbol);
          graphicArray.push(highlightGraphic);
          multiPolygonGeometries.push(response.features[i].geometry);
        }
        selectionLayer.graphics.addMany(graphicArray);
        return response;
      })
      .then(unionGeometries);
  }

  //Input geometry, output buffer
  function createBuffer(response) {
    var bufferGeometry = response;
    // var bufferGeometry = response.features[0].geometry
    var buffer = geometryEngine.geodesicBuffer(bufferGeometry, 300, "feet", true);
    // add the buffer to the view as a graphic
    var bufferGraphic = new Graphic({
      geometry: buffer,
      symbol: highlightSymbol
    });
    bufferLayer.graphics.removeAll();
    bufferLayer.add(bufferGraphic);
    return buffer;
  }

  ///////////////////////
  /// Zoom to Feature ///
  ///////////////////////


  // Build County Drop Down
  buildSelectPanel(controlLinesURL + "4", "ctyname", "Zoom to a County", "selectCountyPanel");

  //Zoom to feature
  query("#selectCountyPanel").on("change", function (e) {
    resetElements(document.getElementById('selectCountyPanel'));
    return zoomToFeature(controlLinesURL + "4", e.target.value, "ucname")
  });

  //Build Quad Dropdown panel
  buildSelectPanel(controlLinesURL + "0", "tile_name", "Zoom to a Quad", "selectQuadPanel");

  //Zoom to feature
  query("#selectQuadPanel").on("change", function (e) {
    resetElements(document.getElementById('selectQuadPanel'));
    return zoomToFeature(controlLinesURL + "0", e.target.value, "tile_name");
  });

  //Build City Dropdown panel
  buildSelectPanel(controlLinesURL + "3", "name", "Zoom to a City", "selectCityPanel");

  //Zoom to feature
  query("#selectCityPanel").on("change", function (e) {
    resetElements(document.getElementById('selectCityPanel'));
    return zoomToFeature(controlLinesURL + "3", e.target.value, "name");
  });

  // function to find visible layers beacuse the layerOptio:visible does NOT work as of 6/1/18 - SWH
  function getVisibleLayerIds(map, layer) {
    if (layer.sublayers) {
      vis_layers = []
      for (i = 0; i < layer.sublayers.length; i++) {
        console.log('vis or not vis for layer ', layer.sublayers.items[i].id, '  ', layer.sublayers.items[i].visible, ' ', layer.sublayers.items[i].title)
        if (layer.sublayers.items[i].visible) {
          vis_layers.push(layer.sublayers.items[i].id)
        }
      }
      //return layer.sublayers.filter(sublayer => sublayers.items.visible).map(sublayer => layer.sublayers.items.id);
      return vis_layers
    } else {
      return layer.visible ? [map.allLayers.indexOf(layer)] : [-1];
    }
  }

  ////////////////////////////////////////////////
  //// Zoom to Township/Section/Range Feature ////
  ////////////////////////////////////////////////

  var townshipSelect = dom.byId("selectTownship");
  var rangeSelect = dom.byId("selectRange");
  var sectionSelect = dom.byId("selectSection");

  mapView.when(function () {
      return townshipRangeSectionLayer.when(function (response) {
        console.log('loading the township now')
        var townshipQuery = new Query();
        townshipQuery.where = "tdir <> ' '";
        townshipQuery.outFields = ["twn_ch", "tdir"];
        townshipQuery.returnDistinctValues = true;
        townshipQuery.orderByFields = ["twn_ch", "tdir"];
        return townshipRangeSectionLayer.queryFeatures(townshipQuery);
      });
    }).then(addToSelect)
    .otherwise(queryError);


  function queryError(error) {
    console.log("Error getting Township Features");
    console.error(error);
  }
  // Add the unique values to the subregion
  // select element. This will allow the user
  // to filter states by subregion.
  function addToSelect(values) {
    var option = domConstruct.create("option");
    option.text = "Zoom to a Township";
    townshipSelect.add(option);

    values.features.forEach(function (value) {
      var option = domConstruct.create("option");
      var name = value.attributes.twn_ch + value.attributes.tdir;
      option.text = name;
      townshipSelect.add(option);

    });
  }

  // Add the unique values to the state
  // select element. This will allow the user
  // to filter states by state and region.
  function addToSelect2(values) {
    var option = domConstruct.create("option");
    option.text = "Zoom to a Range";
    rangeSelect.add(option);

    values.features.forEach(function (value) {
      var option = domConstruct.create("option");
      var name = value.attributes.rng_ch + value.attributes.rdir;
      option.text = name;
      rangeSelect.add(option);
    });
  }

  function addToSelect3(values) {
    var option = domConstruct.create("option");
    option.text = "Zoom to a Section";
    sectionSelect.add(option);

    values.features.forEach(function (value) {
      var option = domConstruct.create("option");
      option.text = value.attributes.sec_ch;
      sectionSelect.add(option);
    });
  }

  on(townshipSelect, "change", function (evt) {
    var type = evt.target.value;
    var i;
    for (i = rangeSelect.options.length - 1; i >= 0; i--) {
      rangeSelect.remove(i);
    }

    var rangeQuery = new Query();
    rangeQuery.where = "twn_ch = '" + type.substr(0, 2) + "' AND tdir = '" + type.substr(2) + "'";
    rangeQuery.outFields = ["rng_ch", "rdir"];
    rangeQuery.returnDistinctValues = true;
    rangeQuery.orderByFields = ["rng_ch", "rdir"];
    return townshipRangeSectionLayer.queryFeatures(rangeQuery).then(addToSelect2);
  })

  on(rangeSelect, "change", function (evt) {
    var type = evt.target.value;
    var j;
    for (j = sectionSelect.options.length - 1; j >= 0; j--) {
      sectionSelect.remove(j);
    }

    var e = document.getElementById("selectTownship");
    var strUser = e.options[e.selectedIndex].text;

    var selectQuery = new Query();
    selectQuery.where = "twn_ch = '" + strUser.substr(0, 2) + "' AND tdir = '" + strUser.substr(2) + "' AND rng_ch = '" + type.substr(0, 2) + "' AND rdir = '" + type.substr(2) + "' AND rng_ch <> ' '";
    selectQuery.outFields = ["sec_ch"];
    selectQuery.returnDistinctValues = true;
    selectQuery.orderByFields = ["sec_ch"];
    return townshipRangeSectionLayer.queryFeatures(selectQuery).then(addToSelect3);
  });

  var querySection = dom.byId("selectSection");
  on(querySection, "change", function (e) {
    var type = e.target.value;
    zoomToSectionFeature(townshipRangeSectionURL, type, "sec_ch");
  });

  var queryRange = dom.byId("selectRange");
  on(queryRange, "change", function (e) {
    var type = e.target.value;
    zoomToTRFeature(townshipRangeSectionURL, type, "rng_ch");
  });

  /////////////////////////
  //// Buffer Identify ////
  /////////////////////////

  var promises, tasks;
  var identifyTask, params;

  tasks = [];
  allParams = [];
  var serviceURLs = [controlPointsURL, controlLinesURL, swfwmdURL];
  var promiseArray = [];

  //Find online services and restrict identify to this
  function checkService(url) {
    promiseArray.push(esriRequest(url, {
      query: {
        f: 'json'
      },
      responseType: 'json'
    }));
  }
  for (var i = 0; i < serviceURLs.length; i++) {
    checkService(serviceURLs[i]);
  }
  var workingServicesURLsObj = {
    urls: []
  };
  var wrappedPromiseArray = promiseArray.map(promise => {
    if (promise) {
      return new Promise((resolve, reject) => {
        promise.then(resolve).catch(resolve);
      });
    }
  });
  Promise.all(wrappedPromiseArray).then(function (values) {
    // console.log(values);
    for (var i = 0; i < values.length; i++) {
      if (values[i].url != undefined)
        workingServicesURLsObj.urls.push(new IdentifyTask(values[i].url));
    }
  });
  console.log("working Service URls");
  tasks = workingServicesURLsObj.urls
  console.log(tasks);


  // Set the parameters for the Point Identify
  params = new IdentifyParameters();
  params.tolerance = 15;
  params.layerOption = "all";
  params.layerIds;
  params.width = mapView.width;
  params.height = mapView.height;
  params.returnGeometry = true;
  allParams.push(params);

  // Set the parameters for the SWFWMD Identify
  params = new IdentifyParameters();
  params.tolerance = 3;
  params.layerIds;
  params.layerOption = "all";
  params.width = mapView.width;
  params.height = mapView.height;
  params.returnGeometry = true;
  allParams.push(params);

  // Set the parameters for the Line / polygon Identify
  params = new IdentifyParameters();
  params.tolerance = 3;
  params.layerIds;
  params.layerOption = "all";
  params.width = mapView.width;
  params.height = mapView.height;
  params.returnGeometry = true;
  allParams.push(params);




  var identifyElements = [];
  var infoPanelData = [];
  var currentIndex;

  // On a double click, execute identifyTask once the map is within the minimum scale
  mapView.on("click", function (event) {
    mapView.graphics.removeAll();
    selectionLayer.graphics.removeAll();
    console.log(mapView.scale);
    if (mapView.scale < minimumDrawScale) {
      event.stopPropagation();
      clearDiv('informationdiv');
      //document.getElementById('numinput').value = "";
      clearDiv('arraylengthdiv');
      executeIdentifyTask(event);
      togglePanel();
    }
  });

  // collapse any of the current panels and switch to the identifyResults panel
  function togglePanel() {

    $('#allpanelsDiv > div').each(function () {
      // turn off all panels that are not target
      if (this.id != 'panelPopup') {
        this.setAttribute('class', 'panel collapse');
        this.setAttribute('style', 'height:0px;');

      } else {
        this.setAttribute('class', 'panel collapse in');
        this.setAttribute('style', 'height:auto;');
        $('#' + this.id + '>div').each(function () {
          if (this.id === 'collapsePopup') {
            this.setAttribute('class', 'panel-collapse collapse in');
            this.setAttribute('style', 'height:auto;');
          }
        });
      }
    });
  }
  // clear all child nodes from current div
  function clearDiv(div) {
    var paramNode = document.getElementById(div);
    while (paramNode.firstChild) {
      paramNode.removeChild(paramNode.firstChild);
    }
  }


  function checkVisibility(layerWidget) {
    var tempVis = []
    console.log(layerWidget);
    for (var i = 0; i < layerWidget.operationalItems.items.length; i++) {
      //console.log(layerWidget.operationalItems.items[i]);
      if (layerWidget.operationalItems.items[i].visible != false) {
        //iterate through sublayers
        for (var j = 0; j < layerWidget.operationalItems.items[i].children.items.length; j++) {
          //console.log(layerWidget.operationalItems.items[i].children.items[j]);
          if (layerWidget.operationalItems.items[i].children.items[j].visible != false) {
            console.log(layerWidget.operationalItems.items[i].children.items[j].layer.title);
            tempVis.push(layerWidget.operationalItems.items[i].children.items[j].layer.id);
          }
        }
        console.log(tempVis);
        allParams[i].layerIds = tempVis;
        console.log(allParams[i].layerIds);
      }
      console.log("allParams ", i, " are ", allParams[i].layerIds);
      console.log("end of layer");
      if (allParams[i].layerIds.length == 0) {
        console.log("allParams are empty: Look! ", allParams[i].layerIds)
        allParams[i].layerIds = [-1];
      }
      tempVis = [];
      //console.log(layerWidget.operationalItems.items[i]);
    }
    console.log('visibility checked.');
  }


  // multi service identifytask
  function executeIdentifyTask(event) {
    console.log('starting the executeIdentifyTask function')
    // first get the visible layers because that option doesnt work
    //vis_layers = getVisibleLayerIds(map,controlPointsLayer)

    // Determine visibility

    checkVisibility(layerWidget);

    console.log("updated allParams ", 0, " is ", allParams[0].layerIds)

    console.log("updated allParams ", 1, " is ", allParams[1].layerIds)

    console.log("updated allParams ", 2, " is ", allParams[2].layerIds)
    console.log(layerWidget);
    //params.layerIds = vis_layers;
    var currentScale = mapView.scale;
    infoPanelData = [];
    identifyElements = [];
    promises = [];
    // Set the geometry to the location of the view click
    if (event.type === "click") {
      allParams[0].geometry = allParams[1].geometry = allParams[2].geometry = event.mapPoint;
      allParams[0].mapExtent = allParams[1].mapExtent = allParams[2].mapExtent = mapView.extent;
    } else {
      allParams[0].geometry = allParams[1].geometry = allParams[2].geometry = event;
      allParams[0].mapExtent = allParams[1].mapExtent = allParams[2].mapExtent = mapView.extent;
      //allParams[0].layerIds = allParams[1].layerIds = allParams[2].layerIds = vis_layers;

    }
    console.log('what does the event look like ', event)
    for (i = 0; i < tasks.length; i++) {
      console.log(tasks[i]);
      console.log('what is this doing--- ', allParams[i])
      promises.push(tasks[i].execute(allParams[i]));
    }

    // create promises for each service to be checked for features
    var iPromises = new all(promises);
    iPromises.then(function (rArray) {
      console.log('iPromises is ', iPromises);
      console.log('rArray is ', rArray);

      var isArrayEmpty = 0
      rArray.forEach(function (element) {
        console.log(element.results.length);
        isArrayEmpty += element.results.length;
      });

      console.log(isArrayEmpty);

      // convert each response to response.results if returned array not empty
      if (isArrayEmpty > 0) {
        arrayUtils.map(rArray, function (response) {
          console.log(response);
          var results = response.results;
          console.log('results yo');
          console.log('here are the objects we found in the section', results);
          // for each resulting array, find the feature and layername to pass to queryinfopanel function
          return arrayUtils.map(results, function (result) {
            console.log(results);
            var feature = result.feature;
            var layerName = result.layerName;
            console.log('the feature is ', feature, '  and the layer name is ', layerName)
            console.log('all of the results look like this ', results)
            feature.attributes.layerName = layerName;
            // only identify the corners that have an image
            if (layerName != 'Certified Corners') {
              console.log(layerName);
              // We want to show Original GLO survey plats and field notes now
              // if (layerName === 'Township-Range-Section') {
              //   // Do nothing
              // } else {
              identifyElements.push(feature);
              infoPanelData.push(feature);
              // }
              // only push Certified Corners with an image
            } else if (layerName === 'Certified Corners') {
              if (feature.attributes.is_image === 'Y') {
                infoPanelData.push(feature);
              }
            }
          });
        })
      } else {
        // reflect that no features were found
        $("#infoSpan").html("Information Panel - 0 features found.")
      }

      // determine whether first index of identify 
      // is a polygon or point then do appropriate highlight and zoom
      if (infoPanelData[0].geometry.type === "polygon" || infoPanelData[0].geometry.type === "polyline") {
        var ext = infoPanelData[0].geometry.extent;
        var cloneExt = ext.clone();
        // This introduces logic to control zooming depending on if the current extent is closer or farther than resulting polygon or polyline
        if (mapView.extent.height < ext.height || mapView.extent.width < ext.width) {
          // no zoom, continue to next block 
          // the map will not zoom out
        } else {
          // the map zooms to extent of polygon
          mapView.goTo({
            target: infoPanelData[0],
            extent: cloneExt.expand(1.75)
          });
        }
        // ^ End logic for zoom control
        // Remove current selection
        selectionLayer.graphics.removeAll();
        console.log("it's a polygon");
        // Highlight the selected parcel
        highlightGraphic = new Graphic(infoPanelData[0].geometry, highlightSymbol);
        selectionLayer.graphics.add(highlightGraphic);

      } else if (infoPanelData[0].geometry.type === "point") {
        console.log("it's a point");
        // Remove current selection
        selectionLayer.graphics.removeAll();

        // Highlight the selected parcel
        highlightGraphic = new Graphic(infoPanelData[0].geometry, highlightPoint);
        selectionLayer.graphics.add(highlightGraphic);
        if (mapView.scale > 18055.954822) {
          mapView.goTo({
            target: infoPanelData[0].geometry,
            zoom: 15
          });
        } else {
          mapView.goTo({
            target: infoPanelData[0].geometry,
            scale: currentScale
          });
        }
      }
      queryInfoPanel(infoPanelData, 1);
      buildUniquePanel();
      //showPopup(identifyElements); 

    });
    // Shows the results of the Identify in a popup once the promise is resolved
    function showPopup(response) {
      if (response.length > 0) {
        mapView.popup.open({
          features: response,
          location: event.mapPoint
        });
      }
      dom.byId("viewDiv").style.cursor = "auto";
    }
  }

  // inputs the geometry of the data query feature, and matches to it. 
  function dataQueryQuerytask(url, geometry) {
    var queryTask = new QueryTask({
      url: url
    });
    var params = new Query({
      where: '1=1',
      geometry: geometry,
      returnGeometry: true,
      outFields: '*'
    });

    return queryTask.execute(params)
      .then(function (response) {
        console.log(response);
        if (response.features.length > 0) {
          return queryTask.execute(params);
        } else {
          console.log('No features found.');
          $("#informationdiv").append("No features found.");
          clearDiv('arraylengthdiv');
        }
      });
  }

  // go to first feature of the infopaneldata array
  function goToFeature(feature) {

    console.log(feature.geometry.type);
    // Go to the selected parcel
    if (feature.geometry.type === "polygon" || feature.geometry.type === "polyline") {
      var ext = feature.geometry.extent;
      var cloneExt = ext.clone();
      mapView.goTo({
        target: feature,
        extent: cloneExt.expand(1.75)
      });
      // Remove current selection
      selectionLayer.graphics.removeAll();
      console.log("it's a polygon");
      // Highlight the selected parcel
      highlightGraphic = new Graphic(feature.geometry, highlightSymbol);
      selectionLayer.graphics.add(highlightGraphic);
    } else if (feature.geometry.type === "point") {
      console.log("it's a point");


      // Remove current selection
      selectionLayer.graphics.removeAll();

      // Highlight the selected parcel
      highlightGraphic = new Graphic(feature.geometry, highlightPoint);
      selectionLayer.graphics.add(highlightGraphic);
      mapView.goTo({
        target: feature.geometry,
        zoom: 15
      });
    }
  }


  //////////////////////////////////
  //// Search Widget Text Search ///
  //////////////////////////////////

  // Search - add to navbar
  var searchWidget = new Search({
    container: "searchWidgetDiv",
    view: mapView,
    allPlaceholder: "Text search for NGS, DEP, and SWFWMD Data",
    sources: [{
      locator: new Locator({
        url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
      }),
      singleLineFieldName: "SingleLine",
      name: "Addresses and Points of Interest",
      localSearchOptions: {
        minScale: 300000,
        distance: 50000
      },
      placeholder: "Search Geocoder",
      maxResults: 3,
      maxSuggestions: 6,
      suggestionsEnabled: true,
      minSuggestCharacters: 0
    }, {
      featureLayer: {
        url: controlPointsURL + "0",
      },
      searchFields: ["name"],
      suggestionTemplate: "Designation: {name}, County {county}",
      displayField: "name",
      zoomScale: 100000,
      exactMatch: false,
      popupOpenOnSelect: false,
      resultSymbol: highlightPoint,
      outFields: ["dec_lat", "dec_long", "pid", "county", "data_srce", "datasheet2", "name"],
      name: "NGS Control Points",
      placeholder: "Search by Designation",
    }, {
      featureLayer: {
        url: controlPointsURL + "4",
      },
      searchFields: ["id", "countyname", "quadname"],
      displayField: "id",
      zoomScale: 100000,
      exactMatch: false,
      popupOpenOnSelect: false,
      resultSymbol: highlightPoint,
      outFields: ["*"],
      name: "Tide Stations",
      placeholder: "Search by ID, County Name, or Quad Name",
    }, {
      featureLayer: {
        url: controlPointsURL + "5",
      },
      searchFields: ["iden", "cname", "tile_name", "station1", "station2"],
      suggestionTemplate: "ID: {iden}, County: {cname}",
      displayField: "iden",
      zoomScale: 100000,
      exactMatch: false,
      popupOpenOnSelect: false,
      resultSymbol: highlightPoint,
      outFields: ["*"],
      name: "Tide Interpolation Points",
      placeholder: "Search by ID, County Name, Quad Name, or Station Name",
    }, {
      featureLayer: {
        url: controlPointsURL + "8",
      },
      searchFields: ["monument_name", "county"],
      suggestionTemplate: "R-Monument Name: {monument_name}, County: {county}",
      zoomScale: 100000,
      exactMatch: false,
      popupOpenOnSelect: false,
      resultSymbol: highlightPoint,
      outFields: ["*"],
      name: "R-Monuments",
      placeholder: "Search by County Name or R-Monument Name",
    }, {
      featureLayer: {
        url: controlPointsURL + "9",
      },
      searchFields: ["ecl_name", "county"],
      suggestionTemplate: "ECL Name: {ecl_name}, County: {county}",
      zoomScale: 150000,
      exactMatch: false,
      popupOpenOnSelect: false,
      resultSymbol: highlightLine,
      outFields: ["*"],
      name: "Erosion Control Lines",
      placeholder: "Search by County Name or Town Name",
    }, {
      featureLayer: {
        url: swfwmdURL
      },
      searchFields: ["BENCHMARK_NAME"],
      suggestionTemplate: "Benchmark Name: {BENCHMARK_NAME}, File Name: {FILE_NAME}",
      zoomScale: 100000,
      displayField: "BENCHMARK_NAME",
      exactMatch: false,
      popupOpenOnSelect: false,
      resultSymbol: highlightPoint,
      outFields: ["BENCHMARK_NAME", "FILE_NAME"],
      name: "Survey Benchmarks",
      placeholder: "Benchmark Name Example: CYP016",
    }, {
      featureLayer: {
        url: controlPointsURL + "2",
      },
      searchFields: ["blmid", "tile_name"],
      displayField: "blmid",
      suggestionTemplate: "BLMID: {blmid}, Quad Name: {tile_name}",
      zoomScale: 100000,
      exactMatch: false,
      popupOpenOnSelect: false,
      resultSymbol: highlightPoint,
      outFields: ["blmid", "tile_name", "image1", "image2", "objectid"],
      name: "Certified Corners",
      placeholder: "Search by BLMID or Quad Name",
    }, {
      featureLayer: {
        url: controlLinesURL + "2",
      },
      searchFields: ["twn_ch", "rng_ch", "twnrngsec"],
      displayField: "twnrngsec",
      suggestionTemplate: "Township/Range/Section: {twnrngsec}",
      zoomScale: 50000,
      exactMatch: false,
      popupOpenOnSelect: false,
      resultSymbol: highlightSymbol,
      outFields: ["twn_ch", "rng_ch", "twnrngsec"],
      name: "Township Range",
      placeholder: "Search by township, range, or township range."
    }],
  });

  CalciteMapsArcGISSupport.setSearchExpandEvents(searchWidget);


  ////////////////////////////
  ///// Data Query////////////
  ////////////////////////////

  // Layer choices to query
  var layerChoices = ['Select Layer', 'NGS Control Points', 'Certified Corners', 'Tide Interpolation Points', 'Tide Stations', 'Erosion Control Line', 'Survey Benchmarks'];

  for (var i = 0; i < layerChoices.length; i++) {
    $('<option/>').val(layerChoices[i]).text(layerChoices[i]).appendTo('#selectLayerDropdown');
  }
  query("#selectLayerDropdown").on("change", function (e) {
    var queriedFeatures = [];


    //Quad select
    //buildSelectPanel(controlLinesURL + "0", "tile_name", "Zoom to a Quad", "selectQuadPanel");

    function getGeometry(url, attribute, value) {
      var value = value.replace(/ *\([^)]*\) */g, "")
      console.log(value);

      var task = new QueryTask({
        url: url
      });
      var query = new Query();
      query.returnGeometry = true;
      //query.outFields = ['*'];
      query.where = attribute + " LIKE '" + value.toUpperCase() + "%'"; //"ctyname = '" + value + "'" needs to return as ctyname = 'Brevard'

      console.log(task.execute(query));
      return task.execute(query);





      // for (i=0; i<results.features.length; i++) {
      //   multiPolygonGeometries.push(results.features[i]);
      // }

    }

    // unused, could be removed
    function dataQueryIdentify(url, response, layers) {
      console.log(response);

      identifyTask = new IdentifyTask(url);

      // Set the parameters for the Identify
      params = new IdentifyParameters();
      //params.tolerance = 3;
      //params.layerIds = [layers];
      params.layerOption = "visible";
      params.width = mapView.width;
      params.height = mapView.height;

      // Set the geometry to the location of the view click
      params.geometry = response;
      params.mapExtent = mapView.extent;
      dom.byId("mapViewDiv").style.cursor = "wait";

      return identifyTask.execute(params);
    }
    // data query by text
    function multiTextQuerytask(url, attribute, queryStatement, idAttribute, idQueryStatement) {

      var whereStatement;

      if (queryStatement != '' || idQueryStatement != '') {
        whereStatement = "Upper(" + attribute + ') LIKE ' + "'%" + queryStatement.toUpperCase() + "%'" + ' or ' + "Upper(" + idAttribute + ') LIKE ' + "'%" + idQueryStatement.toUpperCase() + "%'";
      } else {
        console.log('No features found.');
      }


      //whereStatement = attribute +  ' = ' + "'" + queryStatement + "'";
      console.log(whereStatement);

      var queryTask = new QueryTask({
        url: url
      });
      var params = new Query({
        where: whereStatement,
        returnGeometry: true,
        // possibly could be limited to return only necessary outfields
        outFields: '*'
      });
      return queryTask.execute(params)
        .then(function (response) {
          console.log(response);
          if (response.features.length > 0) {
            return queryTask.execute(params);
          } else {
            togglePanel();
            $('#infoSpan').html("Information Panel - 0 features found.")
            console.log('No features found.');
            $('#informationdiv').append("No features found.");
            clearDiv('arraylengthdiv');
          }
        });
    }

    // data query by text
    function textQueryQuerytask(url, attribute, queryStatement, flag = true) {

      var whereStatement;
      if (queryStatement != '') {
        if (typeof queryStatement == 'string' && flag === true) {
          whereStatement = "Upper(" + attribute + ') LIKE ' + "'%" + queryStatement.toUpperCase() + "%'";
        } else {
          whereStatement = attribute + ' = ' + "'" + queryStatement + "'";
        }
      } else {
        console.log('No features found.');
      }

      console.log(whereStatement);

      var queryTask = new QueryTask({
        url: url
      });
      var params = new Query({
        where: whereStatement,
        returnGeometry: true,
        // possibly could be limited to return only necessary outfields
        outFields: '*'
      });
      return queryTask.execute(params)
        .then(function (response) {
          console.log('response length ', response.features.length);
          if (response.features.length > 0) {
            return queryTask.execute(params);
          } else {
            togglePanel();
            console.log('No features found.');
            $('#informationdiv').append("No features found.");
            clearDiv('arraylengthdiv');
          }
        });;
    }

    function createCountyDropdown(attributeURL, countyAttribute) {
      var countyDropdown = document.createElement('select');
      countyDropdown.setAttribute('id', 'countyQuery');
      countyDropdown.setAttribute('class', 'form-control');
      document.getElementById('parametersQuery').appendChild(countyDropdown);
      buildSelectPanel(attributeURL, countyAttribute, "Select a County", "countyQuery");


    }

    function createQuadDropdown(attributeURL, quadAttribute) {
      var quadDropdown = document.createElement('select');
      quadDropdown.setAttribute('id', 'quadQuery');
      quadDropdown.setAttribute('class', 'form-control');
      document.getElementById('parametersQuery').appendChild(quadDropdown);
      buildSelectPanel(attributeURL, quadAttribute, "Select a Quad", "quadQuery")

    }

    function createTextBox(id, placeholder) {
      var textbox = document.createElement('input');
      textbox.type = 'text';
      textbox.setAttribute('id', id);
      textbox.setAttribute('class', 'form-control');
      textbox.setAttribute('placeholder', placeholder);
      textbox.setAttribute('value', '');
      document.getElementById('parametersQuery').appendChild(textbox);
    }

    function createSubmit(text = 'Submit', id = 'submitQuery') {
      var submitButton = document.createElement('BUTTON');
      submitButton.setAttribute('id', id);
      submitButton.setAttribute('class', 'btn btn-primary');
      var t = document.createTextNode(text);
      submitButton.appendChild(t);
      document.getElementById('parametersQuery').appendChild(submitButton);

    }

    function createTextDescription(string) {
      var textDescription = document.createElement("P");
      var t = document.createTextNode(string);
      textDescription.appendChild(t);
      document.getElementById('parametersQuery').appendChild(textDescription);
    }

    function addDescript() {
      $('#parametersQuery').html('<br><p>Filter by the following options: </p><br>');
    }

    var layerSelection = e.target.value;
    if (layerSelection === "Select Layer") {
      //clear div
      clearDiv();

    } else if (layerSelection === 'NGS Control Points') {
      // clear the div of the previous input
      clearDiv('parametersQuery');
      // add dropdown, input, and submit elements
      addDescript();
      createCountyDropdown(controlPointsURL + '0', 'county');
      createQuadDropdown(controlPointsURL + '0', 'quad');
      createTextBox('textQuery', 'Enter NGS Name or PID.');
      createSubmit();

      var countyDropdownAfter = document.getElementById('countyQuery');
      // county event listener
      query(countyDropdownAfter).on('change', function (e) {
        clearDiv('informationdiv');
        resetElements(countyDropdownAfter);
        infoPanelData = [];

        getGeometry(controlLinesURL + '4', 'ucname', e.target.value)
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(controlPointsURL + '0', response)
              .then(function (response) {
                for (i = 0; i < response.features.length; i++) {
                  response.features[i].attributes.layerName = 'NGS Control Points QueryTask';
                  infoPanelData.push(response.features[i]);
                }
                goToFeature(infoPanelData[0]);
                queryInfoPanel(infoPanelData, 1);
                togglePanel();
              });
          });
      });

      // Query the quad dropdown
      var quadDropdownAfter = document.getElementById('quadQuery');

      query(quadDropdownAfter).on('change', function (e) {
        clearDiv('informationdiv');
        resetElements(quadDropdownAfter);
        infoPanelData = [];

        getGeometry(controlLinesURL + '0', 'tile_name', e.target.value)
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(controlPointsURL + '0', response)
              .then(function (response) {
                for (i = 0; i < response.features.length; i++) {
                  response.features[i].attributes.layerName = 'NGS Control Points QueryTask';
                  infoPanelData.push(response.features[i]);
                }
                goToFeature(infoPanelData[0]);
                queryInfoPanel(infoPanelData, 1);
                togglePanel();
              });
          });
      });

      // Textbox Query
      var textboxAfter = document.getElementById('textQuery');

      query(textboxAfter).on('keypress', function () {
        // once typing begins, all of the other elements in the map will reset
        resetElements(textboxAfter);
      });

      var submitAfter = document.getElementById('submitQuery');
      query(submitAfter).on('click', function (e) {
        clearDiv('informationdiv');
        infoPanelData = [];
        var textValue = document.getElementById('textQuery').value;

        //textQueryQuerytask(controlPointsURL + '0', 'pid', textValue)
        multiTextQuerytask(controlPointsURL + '0', 'pid', textValue, 'name', textValue)
          .then(function (response) {
            for (i = 0; i < response.features.length; i++) {
              response.features[i].attributes.layerName = 'NGS Control Points QueryTask';
              infoPanelData.push(response.features[i]);
            }
            goToFeature(infoPanelData[0]);
            queryInfoPanel(infoPanelData, 1);
            togglePanel();
          });
      });

    } else if (layerSelection === "Certified Corners") {
      // clear div of previous input
      clearDiv('parametersQuery');
      // add input, and submit elements
      createTextDescription("Example: T28SR22E600200 (or first characters, e.g. t28s)");
      createTextBox('IDQuery', 'Enter a Certified Corner BLMID.');
      createSubmit();
      var textboxAfter = document.getElementById('IDQuery');

      var submitAfter = document.getElementById('submitQuery');
      query(submitAfter).on('click', function (e) {
        clearDiv('informationdiv');
        infoPanelData = [];
        var textValue = document.getElementById('IDQuery').value;

        console.log(textValue);
        textQueryQuerytask(controlPointsURL + '2', 'blmid', textValue)
          .then(function (response) {
            console.log(response);
            for (i = 0; i < response.features.length; i++) {
              response.features[i].attributes.layerName = 'Certified Corners';
              infoPanelData.push(response.features[i]);
            }
            goToFeature(infoPanelData[0]);
            queryInfoPanel(infoPanelData, 1);
            togglePanel();
          });
      });

    } else if (layerSelection === 'Tide Interpolation Points') {

      clearDiv('parametersQuery');
      addDescript();
      createCountyDropdown(controlPointsURL + '5', 'cname');
      createQuadDropdown(controlPointsURL + '5', 'tile_name');
      createTextBox('IDQuery', 'Enter an ID. Example: 1');
      createSubmit();

      var countyDropdownAfter = document.getElementById('countyQuery');

      query(countyDropdownAfter).on('change', function (e) {
        clearDiv('informationdiv');
        resetElements(countyDropdownAfter);
        infoPanelData = [];
        console.log(e.target.value);

        getGeometry(controlLinesURL + '4', 'ucname', e.target.value)
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(controlPointsURL + '5', response)
              .then(function (response) {
                for (i = 0; i < response.features.length; i++) {
                  response.features[i].attributes.layerName = 'Tide Interpolation Points';
                  infoPanelData.push(response.features[i]);
                }
                goToFeature(infoPanelData[0]);
                queryInfoPanel(infoPanelData, 1);
                togglePanel();
              });
          });
      });

      // Query the quad dropdown
      var quadDropdownAfter = document.getElementById('quadQuery');

      query(quadDropdownAfter).on('change', function (e) {
        clearDiv('informationdiv');
        resetElements(quadDropdownAfter);
        infoPanelData = [];

        getGeometry(controlLinesURL + '0', 'tile_name', e.target.value)
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(controlPointsURL + '5', response)
              .then(function (response) {
                for (i = 0; i < response.features.length; i++) {
                  response.features[i].attributes.layerName = 'Tide Interpolation Points';
                  infoPanelData.push(response.features[i]);
                }
                goToFeature(infoPanelData[0]);
                queryInfoPanel(infoPanelData, 1);
                togglePanel();
              });
          });
      });

      // Textbox Query
      var textboxAfter = document.getElementById('IDQuery');

      query(textboxAfter).on('keypress', function () {
        clearDiv('informationdiv');
        resetElements(textboxAfter);
      });

      var submitAfter = document.getElementById('submitQuery');
      query(submitAfter).on('click', function (e) {
        clearDiv('informationdiv');
        infoPanelData = [];
        var textValue = document.getElementById('IDQuery').value;
        textValue = parseInt(textValue);

        textQueryQuerytask(controlPointsURL + '5', 'iden', textValue)
          .then(function (response) {
            for (i = 0; i < response.features.length; i++) {
              response.features[i].attributes.layerName = 'Tide Interpolation Points';
              infoPanelData.push(response.features[i]);
            }
            goToFeature(infoPanelData[0]);
            queryInfoPanel(infoPanelData, 1);
            togglePanel();
          });
      });

    } else if (layerSelection === 'Tide Stations') {
      clearDiv('parametersQuery');
      addDescript();
      createCountyDropdown(controlPointsURL + '4', 'countyname');
      createQuadDropdown(controlPointsURL + '4', 'quadname');
      createTextBox('textQuery', 'Enter Tide Station ID or Name');
      createSubmit();
      var countyDropdownAfter = document.getElementById('countyQuery');

      query(countyDropdownAfter).on('change', function (e) {
        clearDiv('informationdiv');
        resetElements(countyDropdownAfter);
        infoPanelData = [];

        getGeometry(controlLinesURL + '4', 'ucname', e.target.value)
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(controlPointsURL + '4', response)
              .then(function (response) {
                for (i = 0; i < response.features.length; i++) {
                  response.features[i].attributes.layerName = 'Tide Stations';
                  infoPanelData.push(response.features[i]);
                }
                goToFeature(infoPanelData[0]);
                queryInfoPanel(infoPanelData, 1);
                togglePanel();
              });
          });
      });

      // Query the quad dropdown
      var quadDropdownAfter = document.getElementById('quadQuery');

      query(quadDropdownAfter).on('change', function (e) {
        clearDiv('informationdiv');
        resetElements(quadDropdownAfter);
        infoPanelData = [];

        getGeometry(controlLinesURL + '0', 'tile_name', e.target.value)
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(controlPointsURL + '4', response)
              .then(function (response) {
                console.log(response);
                for (i = 0; i < response.features.length; i++) {
                  response.features[i].attributes.layerName = 'Tide Stations';
                  infoPanelData.push(response.features[i]);
                }
                console.log(infoPanelData);
                goToFeature(infoPanelData[0]);
                queryInfoPanel(infoPanelData, 1);
                togglePanel();
              });
          });
      });

      // query id and name fields through two buttons
      var inputAfter = document.getElementById('textQuery');
      var submitButton = document.getElementById('submitQuery');

      // clear other elements when keypress happens
      query(inputAfter).on('keypress', function () {
        clearDiv('informationdiv');
        resetElements(inputAfter);
      });

      query(submitButton).on('click', function (e) {
        infoPanelData = [];
        var textValue = inputAfter.value;


        multiTextQuerytask(controlPointsURL + '4', 'id', textValue, 'name', textValue)

          .then(function (response) {
            clearDiv('informationdiv');
            for (i = 0; i < response.features.length; i++) {
              response.features[i].attributes.layerName = 'Tide Stations';
              infoPanelData.push(response.features[i]);
            }
            goToFeature(infoPanelData[0]);
            queryInfoPanel(infoPanelData, 1);
            togglePanel();
          });
      });

      // query(submitButton).on('click', function (e) {
      //   clearDiv('informationdiv');
      //   infoPanelData = [];
      //   textQueryQuerytask(controlPointsURL + '4', 'name', inputAfter.value)
      //     .then(function (response) {
      //       for (i = 0; i < response.features.length; i++) {
      //         response.features[i].attributes.layerName = 'Tide Stations';
      //         infoPanelData.push(response.features[i]);
      //       }
      //       goToFeature(infoPanelData[0]);
      //       queryInfoPanel(infoPanelData, 1);
      //       togglePanel();
      //     });
      // });

    } else if (layerSelection === 'Erosion Control Line') {
      clearDiv('parametersQuery');
      addDescript();
      createCountyDropdown(controlPointsURL + '9', 'county');
      createTextBox('textQuery', 'Enter an ECL Name')
      createSubmit();

      var submitButton = document.getElementById('submitQuery');
      var countyDropdownAfter = document.getElementById('countyQuery');
      var inputAfter = document.getElementById('textQuery');


      // clear other elements when keypress happens
      query(inputAfter).on('keypress', function () {
        clearDiv('informationdiv');
        resetElements(inputAfter);
      });

      query(countyDropdownAfter).on('change', function (e) {
        clearDiv('informationdiv');
        resetElements(countyDropdownAfter);
        infoPanelData = [];
        console.log('grabbing geometry');
        getGeometry(controlLinesURL + '4', 'ucname', e.target.value)
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(controlPointsURL + '9', response)
              .then(function (response) {
                for (i = 0; i < response.features.length; i++) {
                  response.features[i].attributes.layerName = 'Erosion Control Line';
                  infoPanelData.push(response.features[i]);
                }
                goToFeature(infoPanelData[0]);
                queryInfoPanel(infoPanelData, 1);
                togglePanel();
              });
          });
      });

      query(submitButton).on('click', function (e) {
        clearDiv('informationdiv');
        infoPanelData = [];
        textQueryQuerytask(controlPointsURL + '9', 'ecl_name', inputAfter.value)
          .then(function (response) {
            console.log(response)
            for (i = 0; i < response.features.length; i++) {
              response.features[i].attributes.layerName = 'Erosion Control Line';
              infoPanelData.push(response.features[i]);
            }
            goToFeature(infoPanelData[0]);
            queryInfoPanel(infoPanelData, 1);
            togglePanel();
          });
      });

    } else if (layerSelection === 'Survey Benchmarks') {
      clearDiv('parametersQuery');
      addDescript();
      createTextBox('textQuery', 'Benchmark Name Example: CYP016')
      createSubmit('Submit by Name', 'submitNameQuery');

      var submitButton = document.getElementById('submitNameQuery');
      var inputAfter = document.getElementById('textQuery');


      // clear other elements when keypress happens
      query(inputAfter).on('keypress', function () {
        clearDiv('informationdiv');
        resetElements(inputAfter);
      });

      query(submitButton).on('click', function (e) {
        infoPanelData = [];
        textQueryQuerytask(swfwmdURL + '/0', 'BENCHMARK_NAME', inputAfter.value)
          .then(function (response) {
            for (i = 0; i < response.features.length; i++) {
              response.features[i].attributes.layerName = 'Survey Benchmarks';
              infoPanelData.push(response.features[i]);
            }
            goToFeature(infoPanelData[0]);
            queryInfoPanel(infoPanelData, 1);
            togglePanel();
          });
      });
    }
  });



  ////////////////////////////
  ///// Event Listeners //////
  ////////////////////////////



  //// Clickable Links 


  // Switch to Data Query panel on click
  query('#gobackBtn').on('click', function () {
    var identifyPanel = document.getElementById('panelPopup');
    var identifyStyle = document.getElementById('collapsePopup');
    var dataQueryPanel = document.getElementById('panelQuery');

    identifyPanel.setAttribute('class', 'panel collapse');
    identifyPanel.setAttribute('style', 'height:0px;');

    identifyStyle.setAttribute('class', 'panel-collapse collapse');
    identifyStyle.setAttribute('style', 'height:0px;');

    dataQueryPanel.setAttribute('class', 'panel collapse in');
    dataQueryPanel.setAttribute('style', 'height:auto;');
  });


  // Switch panel to zoom to feature panel
  query('#gotozoom').on('click', function () {
    var identifyPanel = document.getElementById('panelPopup');
    var identifyStyle = document.getElementById('collapsePopup');
    var zoomToFeaturePanel = document.getElementById('panelLayer');
    var zoomToFeaturePanelBody = document.getElementById('collapseLayer')

    identifyPanel.setAttribute('class', 'panel collapse');
    identifyPanel.setAttribute('style', 'height:0px;');

    identifyStyle.setAttribute('class', 'panel-collapse collapse');
    identifyStyle.setAttribute('style', 'height:0px;');

    zoomToFeaturePanel.setAttribute('class', 'panel collapse in');
    zoomToFeaturePanel.setAttribute('style', 'height:auto;');

    zoomToFeaturePanelBody.setAttribute('class', 'panel collapse in');
    zoomToFeaturePanelBody.setAttribute('style', 'height:auto;');
  });

  // switch to identify panel on click
  query('#goToIdentify').on('click', function () {
    togglePanel();
  });

  //Basemap panel change
  query("#selectBasemapPanel").on("change", function (e) {
    mapView.map.basemap = e.target.value;
  });

  // Clear all graphics from map  
  on(dom.byId("clearButton"), "click", function (evt) {
    mapView.graphics.removeAll();
    selectionLayer.graphics.removeAll();
    bufferLayer.graphics.removeAll();
    clearDiv('informationdiv');
    $('#numinput').val('');
    $('#arraylengthdiv').html('');
    $('#infoSpan').html('Information Panel');
  });

  // dynamically add and remove coordinates widget
  var coordStatus;
  on(dom.byId("coordButton"), "click", function (evt) {
    if (coordStatus != 1) {
      //mapView.ui.add(ccWidget, "bottom-left");
      mapView.ui.add(ccWidget, "bottom-left");


      // Regular expression to find a number
      var numberSearchPattern = /-?\d+[\.]?\d*/;

      var statePlaneEastFL = new Format({
        name: 'FSP E',
        conversionInfo: {
          spatialReference: new SpatialReference({
            wkid: 2881
          }),
          reverseConvert: function (string, format) {
            var parts = string.split(",")
            return new Point({
              x: parseFloat(parts[0]),
              y: parseFloat(parts[1]),
              spatialReference: {
                wkid: 2881
              }
            });
          }
        },
        coordinateSegments: [{
          alias: "X",
          description: "easting",
          searchPattern: numberSearchPattern
        }, {
          alias: "Y",
          description: "northing",
          searchPattern: numberSearchPattern
        }],
        defaultPattern: "X, Y"
      });

      ccWidget.formats.add(statePlaneEastFL);

      var statePlaneWestFL = new Format({
        name: 'FSP W',
        conversionInfo: {
          spatialReference: new SpatialReference({
            wkid: 2882
          }),
          reverseConvert: function (string, format) {
            var parts = string.split(",")
            return new Point({
              x: parseFloat(parts[0]),
              y: parseFloat(parts[1]),
              spatialReference: {
                wkid: 2882
              }
            });
          }
        },
        coordinateSegments: [{
          alias: "X",
          description: "easting",
          searchPattern: numberSearchPattern
        }, {
          alias: "Y",
          description: "northing",
          searchPattern: numberSearchPattern
        }],
        defaultPattern: "X, Y"
      });

      ccWidget.formats.add(statePlaneWestFL);

      var statePlaneNorthFL = new Format({
        name: 'FSP N',
        conversionInfo: {
          spatialReference: new SpatialReference({
            wkid: 2883
          }),
          reverseConvert: function (string, format) {
            var parts = string.split(",")
            return new Point({
              x: parseFloat(parts[0]),
              y: parseFloat(parts[1]),
              spatialReference: {
                wkid: 2883
              }
            });
          }
        },
        coordinateSegments: [{
          alias: "X",
          description: "easting",
          searchPattern: numberSearchPattern
        }, {
          alias: "Y",
          description: "northing",
          searchPattern: numberSearchPattern
        }],
        defaultPattern: "X, Y"
      });

      ccWidget.formats.add(statePlaneNorthFL);

      // Add the two custom formats to the top of the widget's display
      ccWidget.conversions.splice(0, 0,
        new Conversion({
          format: statePlaneEastFL
        }),
        new Conversion({
          format: statePlaneWestFL
        }),
        new Conversion({
          format: statePlaneNorthFL
        })
      );
      coordStatus = 1;
    } else {
      mapView.ui.remove(ccWidget);
      coordStatus = 0;
    }
  });

  // //Custom Zoom to feature
  // mapView.popup.on("trigger-action", function (evt) {
  //   if (evt.action.id === "custom-zoom") {
  //     selectionLayer.graphics.removeAll();
  //     console.log(mapView.popup.selectedFeature);
  //     mapView.goTo({
  //       target: mapView.popup.selectedFeature.geometry,
  //       zoom: 17
  //     });
  //     highlightGraphic = new Graphic(mapView.popup.selectedFeature.geometry, highlightSymbol);
  //     selectionLayer.graphics.add(highlightGraphic);
  //   };
  // });


  searchWidget.on("search-complete", function (event) {

    infoPanelData = [];

    if (event.results["0"].source.locator) {
      // let native functionality work
    } else {
      var layerName = event.results["0"].source.featureLayer.source.layerDefinition.name;
      if (layerName === 'NGS Control Points') {
        event.results["0"].results["0"].feature.attributes.layerName = 'NGS Control Points QueryTask';
      } else {
        event.results["0"].results["0"].feature.attributes.layerName = layerName;
      }
      infoPanelData.push(event.results["0"].results["0"].feature);
      queryInfoPanel(infoPanelData, 1);
      togglePanel();
    }
  });


  query("#numinput").on("change", function (e) {
    console.log("target value");
    console.log(e.target.value);
    if (e.target.value <= infoPanelData.length && e.target.value >= 1) {
      queryInfoPanel(infoPanelData, e.target.value);
      var itemVal = $('#numinput').val();
      var indexVal = parcelVal - 1;

      // Determine the index value
      var parcelVal = $('#numinput').val();
      var indexVal = parcelVal - 1;

      // Go to the selected parcel
      if (infoPanelData[indexVal].geometry.type === "polygon") {
        var ext = infoPanelData[indexVal].geometry.extent;
        var cloneExt = ext.clone();
        if (infoPanelData[indexVal].attributes.layerName !== 'USGS Quads') {
          mapView.goTo({
            target: infoPanelData[indexVal],
            extent: cloneExt.expand(1.75)
          });
        }
        // Remove current selection
        selectionLayer.graphics.removeAll();
        console.log("it's a polygon");
        // Highlight the selected parcel
        highlightGraphic = new Graphic(infoPanelData[indexVal].geometry, highlightSymbol);
        selectionLayer.graphics.add(highlightGraphic);
      } else if (infoPanelData[indexVal].geometry.type === "point") {
        console.log("it's a point");


        // Remove current selection
        selectionLayer.graphics.removeAll();

        // Highlight the selected parcel
        highlightGraphic = new Graphic(infoPanelData[indexVal].geometry, highlightPoint);
        selectionLayer.graphics.add(highlightGraphic);
        mapView.goTo({
          target: infoPanelData[indexVal].geometry,
          zoom: 15
        });
      }
    } else {
      //$('#numinput').val(currentIndex);
      console.log("number out of range");
    }
  });

  // Listen for the back button
  query("#back").on("click", function () {
    if ($('#numinput').val() > 1) {
      value = $('#numinput').val();
      value = parseInt(value);
      queryInfoPanel(infoPanelData, --value);
      $('#numinput').val(value);

      // Determine the index value
      var parcelVal = $('#numinput').val();
      var indexVal = parcelVal - 1;

      // Go to the selected parcel
      if (infoPanelData[indexVal].geometry.type === "polygon") {
        var ext = infoPanelData[indexVal].geometry.extent;
        var cloneExt = ext.clone();
        mapView.goTo({
          target: infoPanelData[indexVal],
          extent: cloneExt.expand(1.75)
        });
        // Remove current selection
        selectionLayer.graphics.removeAll();
        console.log("it's a polygon");
        // Highlight the selected parcel
        highlightGraphic = new Graphic(infoPanelData[indexVal].geometry, highlightSymbol);
        selectionLayer.graphics.add(highlightGraphic);
      } else if (infoPanelData[indexVal].geometry.type === "point") {
        console.log("it's a point");


        // Remove current selection
        selectionLayer.graphics.removeAll();

        // Highlight the selected parcel
        highlightGraphic = new Graphic(infoPanelData[indexVal].geometry, highlightPoint);
        selectionLayer.graphics.add(highlightGraphic);
        mapView.goTo({
          target: infoPanelData[indexVal].geometry,
          zoom: 15
        });
      }
    }

  });

  // Listen for forward button
  query("#forward").on("click", function () {
    if ($('#numinput').val() < infoPanelData.length) {
      value = $('#numinput').val();
      value = parseInt(value);
      queryInfoPanel(infoPanelData, ++value);
      $('#numinput').val(value);

      // Determine the index value
      var parcelVal = $('#numinput').val();
      var indexVal = parcelVal - 1;

      // Go to the selected parcel
      if (infoPanelData[indexVal].geometry.type === "polygon") {
        var ext = infoPanelData[indexVal].geometry.extent;
        var cloneExt = ext.clone();
        mapView.goTo({
          target: infoPanelData[indexVal],
          extent: cloneExt.expand(1.75)
        });

        // Remove current selection
        selectionLayer.graphics.removeAll();
        console.log("it's a polygon");
        // Highlight the selected parcel
        highlightGraphic = new Graphic(infoPanelData[indexVal].geometry, highlightSymbol);
        selectionLayer.graphics.add(highlightGraphic);
      } else if (infoPanelData[indexVal].geometry.type === "point") {
        console.log("it's a point");


        // Remove current selection
        selectionLayer.graphics.removeAll();

        // Highlight the selected parcel
        highlightGraphic = new Graphic(infoPanelData[indexVal].geometry, highlightPoint);
        selectionLayer.graphics.add(highlightGraphic);
        mapView.goTo({
          target: infoPanelData[indexVal].geometry,
          zoom: 15
        });
      }
    }
  });

  // set up alert for dynamically created zoom to feature buttons
  $(document).on('click', "button[name='zoom']", function () {


    // Go to the selected parcel
    if (infoPanelData[this.id - 1].geometry.type === "polygon" || infoPanelData[this.id - 1].geometry.type === "polyline") {
      console.log('its a polygon or a polyline');
      var ext = infoPanelData[this.id - 1].geometry.extent;
      var cloneExt = ext.clone();
      mapView.goTo({
        target: infoPanelData[this.id - 1],
        extent: cloneExt.expand(1.75)
      });

      // Remove current selection
      selectionLayer.graphics.removeAll();
      console.log("it's a polygon");
      // Highlight the selected parcel
      highlightGraphic = new Graphic(infoPanelData[this.id - 1].geometry, highlightSymbol);
      selectionLayer.graphics.add(highlightGraphic);
    } else if (infoPanelData[this.id - 1].geometry.type === "point") {
      console.log("it's a point");


      // Remove current selection
      selectionLayer.graphics.removeAll();

      // Highlight the selected parcel
      highlightGraphic = new Graphic(infoPanelData[this.id - 1].geometry, highlightPoint);
      selectionLayer.graphics.add(highlightGraphic);
      mapView.goTo({
        target: infoPanelData[this.id - 1].geometry,
        zoom: 15
      });
    }
  });

  /////////////
  // Widgets //
  /////////////


  // Popup and panel sync
  mapView.when(function () {
    CalciteMapsArcGISSupport.setPopupPanelSync(mapView);
  });

  // Basemaps
  var basemaps = new Basemaps({
    container: "basemapGalleryDiv",
    view: mapView
  })




  // LegendLegend
  var legendWidget = new Legend({
    container: "legendDiv",
    view: mapView
  });

  // LayerList
  var layerWidget = new LayerList({
    container: "layersDiv",
    view: mapView
  });


  // // Add a legend instance to the panel of a
  // // ListItem in a LayerList instance
  // const layerList = new LayerList({
  //   container: "legendDiv",
  //   view: mapView,
  //   listItemCreatedFunction: function(event) {
  //     const item = event.item;
  //     item.panel = {
  //       content: "legend",
  //       open: true
  //     };
  //   }
  // });

  //mapView.ui.add(layerList, "top-right");

  // Print
  var printWidget = new Print({
    container: "printDiv",
    view: mapView,
    printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
  });

  // Scalebar
  var scaleBar = new ScaleBar({
    view: mapView
  });
  mapView.ui.add(scaleBar, "bottom-left");


  // Home
  var home = new Home({
    view: mapView
  });
  mapView.ui.add(home, "top-left");

  var locateBtn = new Locate({
    view: mapView
  });
  mapView.ui.add(locateBtn, "top-left");

  //Coordinates widget
  var ccWidget = new CoordinateConversion({
    view: mapView
  });


  //mapView.ui.add(ccWidget, "bottom-left");

  // Fires after the user's location has been found
  /*locateBtn.on("locate", function(event) {
    var bufferGeometry = event.target.graphic.geometry;
    var buffer = geometryEngine.buffer(bufferGeometry, 50, "feet", false)

    console.log(bufferGeometry);
    console.log(buffer);
    var bufferGraphic = new Graphic({
      geometry: buffer,
      symbol: highlightSymbol
    });
    selectionLayer.graphics.removeAll();
    selectionLayer.add(bufferGraphic);

    console.log(selectionLayer.graphics.items[0].geometry);
    executeIdentifyTask(buffer);
    console.log("finished");
  });
*/

  var clearBtn = document.getElementById("clearButton");
  mapView.ui.add(clearBtn, "top-left");

  var coordBtn = document.getElementById("coordButton");
  mapView.ui.add(coordBtn, "top-left");

});