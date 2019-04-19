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
  "esri/widgets/Expand",
  "esri/widgets/DistanceMeasurement2D",
  "esri/widgets/AreaMeasurement2D",
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
  Expand,
  DistanceMeasurement2D,
  AreaMeasurement2D,
  watchUtils, arrayUtils, Deferred, on, dom, domClass, all, domConstruct, domGeom, keys, JSON, lang, query, Color,
  Collapse,
  Dropdown,
  CalciteMaps,
  CalciteMapsArcGISSupport) {

  var minimumDrawScale = 95000;
  var extents = [];

  var countyBoundariesURL = "https://maps.freac.fsu.edu/arcgis/rest/services/FREAC/County_Boundaries/MapServer/";
  var countyBoundariesLayer = new MapImageLayer({
    url: countyBoundariesURL,
    title: "County Boundaries",
    minScale: minimumDrawScale,
    sublayers: [{
      id: 0,
      title: "County Boundaries",
      visible: false,
      popupEnabled: false
    }]
  });

  var labinsURL = "https://maps.freac.fsu.edu/arcgis/rest/services/LABINS/LABINS_Data/MapServer/";
  var labinsLayer = new MapImageLayer({
    url: labinsURL,
    sublayers: [{
      id: 17,
      title: "Soils June 2012 - Dept. of Agriculture",
      visible: false,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 16,
      title: "Hi-Res Imagery Grid State Plane East",
      visible: true,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 15,
      title: "Hi-Res Imagery Grid: State Plane North",
      visible: true,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 14,
      title: "Hi-Res Imagery Grid: State Plane West",
      visible: true,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 13,
      title: "Parcels",
      visible: false,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 12,
      title: "City Limits",
      visible: false,
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
      minScale: minimumDrawScale
    }, {
      id: 11,
      title: "Township-Range-Section",
      visible: true,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 10,
      title: "Township-Range",
      visible: true,
      popupEnabled: false,
      labelsVisible: true,
      // Set label specs for township-range
      labelingInfo: [{
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
      }],
      minScale: minimumDrawScale
    }, {
      id: 9,
      title: "USGS Quads",
      visible: false,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 8,
      title: "Erosion Control Line",
      minScale: 4000000,
      visible: true,
      popupEnabled: false
    }, {
      id: 7,
      title: "R-Monuments",
      visible: true,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 6,
      title: "CCR with Images",
      visible: false,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 4,
      title: "Tide Interpolation Points",
      visible: true,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 3,
      title: "Tide Stations",
      visible: true,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 2,
      title: "Certified Corners",
      visible: true,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 1,
      title: "Preliminary NGS Points",
      visible: false,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 0,
      title: "NGS Control Points",
      visible: true,
      popupEnabled: false,
      minScale: minimumDrawScale
    }]
  });

  // var GNISURL = "https://carto.nationalmap.gov/arcgis/rest/services/geonames/MapServer/";
  // var GNISLayer = new MapImageLayer({
  //   url: GNISURL,
  //   title: "Geographic Names",
  //   minScale: minimumDrawScale,
  //   sublayers: [{
  //     id: 0,
  //     title: "Physical Points",
  //     visible: false,
  //     popupEnabled: false,
  //   }, {
  //     id: 1,
  //     title: "Landforms",
  //     visible: false,
  //     popupEnabled: false,
  //   }, {
  //     id: 2,
  //     title: "Streams (mouth)",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 4,
  //     title: "Cultural Points",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 5,
  //     title: "Airports",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 6,
  //     title: "Buildings",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 7,
  //     title: "Churches",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 8,
  //     title: "Hospitals",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 9,
  //     title: "Schools",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 10,
  //     title: "Bridges, Crossings, and Tunnels",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 11,
  //     title: "Cemeteries",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 12,
  //     title: "Dams",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 19,
  //     title: "Civil Features",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 20,
  //     title: "Forests",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 21,
  //     title: "Parks",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 22,
  //     title: "Reserves",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 23,
  //     title: "Historical Points",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 24,
  //     title: "Historical Cultural-Political Points",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 25,
  //     title: "Historical Hydrographic Points",
  //     visible: false,
  //     popupEnabled: false
  //   }, {
  //     id: 26,
  //     title: "Historical Physical Points",
  //     visible: false,
  //     popupEnabled: false
  //   }]
  // });

  var swfwmdURL = "https://www25.swfwmd.state.fl.us/arcgis12/rest/services/BaseVector/SurveyBM/MapServer/";
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

  // Layers needed for dependent dropdowns
  var townshipRangeSectionURL = "https://maps.freac.fsu.edu/arcgis/rest/services/LABINS/LABINS_Data/MapServer/11"
  var townshipRangeSectionLayer = new FeatureLayer({
    url: townshipRangeSectionURL,
    outFields: ["twn_ch", "rng_ch", "sec_ch"],
    title: "Section Lines",
    visible: false,
    listMode: "hide",
    popupEnabled: false
  });

  var CCCLURL = "https://ca.dep.state.fl.us/arcgis/rest/services/OpenData/COASTAL_ENV_PERM/MapServer/"
  var CCCLLayer = new MapImageLayer({
    url: CCCLURL,
    minScale: minimumDrawScale,
    title: "Coastal Construction Control Lines",
    sublayers: [{
      id: 2,
      title: "Coastal Construction Control Lines",
      visible: true,
      popupEnabled: false
    }]
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
    // layers: [countyBoundariesLayer, labinsLayer, swfwmdLayer, CCCLLayer, townshipRangeSectionLayer, selectionLayer, bufferLayer]
    layers: [selectionLayer, bufferLayer]
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
    zoom: 7,
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
          option.text = value;
          dom.byId(panelParam).add(option);
        });
      });
  }

  // Input location from drop down, zoom to it and highlight
  async function zoomToFeature(panelurl, location, attribute) {
    console.log(location);

    // union features so that they can be returned as a single geometry
    var task = new QueryTask({
      url: panelurl
    });
    var params = new Query({
      where: attribute + " = '" + location + "'",
      returnGeometry: true
    });
    const response = await task.execute(params)
    mapView.goTo(response.features);
    selectionLayer.graphics.removeAll();
    graphicArray = [];

    for (feature of response.features) {
      highlightGraphic = new Graphic(feature.geometry, highlightSymbol);
      graphicArray.push(highlightGraphic);
    }

    selectionLayer.graphics.addMany(graphicArray);
  }

  // Union geometries of multi polygon features
  async function unionGeometries(response) {
    console.log(response);
    // Array to store polygons in
    var multiPolygonGeometries = [];
    for (i = 0; i < response.features.length; i++) {
      multiPolygonGeometries.push(response.features[i].geometry);
    }
    var union = await geometryEngine.union(multiPolygonGeometries);
    console.log('unioning of all pieces is complete', union);
    return union;
  }

  // when a section feature is choses, a matching TRS combination is queried, highlighted and zoomed to
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
  buildSelectPanel(countyBoundariesURL + '0', 'tigername', "Zoom to a County", "selectCountyPanel");

  //Zoom to feature
  query("#selectCountyPanel").on("change", function (e) {
    resetElements(document.getElementById('selectCountyPanel'));
    return zoomToFeature(countyBoundariesURL + '0', e.target.value, 'tigername')
  });

  //Build Quad Dropdown panel
  buildSelectPanel(labinsURL + '9', "tile_name", "Zoom to a Quad", "selectQuadPanel");

  //Zoom to feature
  query("#selectQuadPanel").on("change", function (e) {
    resetElements(document.getElementById('selectQuadPanel'));
    return zoomToFeature(labinsURL + '9', e.target.value, "tile_name");
  });

  //Build City Dropdown panel
  buildSelectPanel(labinsURL + '12', "name", "Zoom to a City", "selectCityPanel");

  //Zoom to feature
  query("#selectCityPanel").on("change", function (e) {
    resetElements(document.getElementById('selectCityPanel'));
    return zoomToFeature(labinsURL + '12', e.target.value, "name");
  });

  ////////////////////////////////////////////////
  //// Zoom to Township/Section/Range Feature ////
  ////////////////////////////////////////////////

  var townshipSelect = dom.byId("selectTownship");
  var rangeSelect = dom.byId("selectRange");
  var sectionSelect = dom.byId("selectSection");

  // when mapView is ready, build the first dropdown for township selection
  mapView.when(async function () {
    var townshipQuery = new Query({
      where: "tdir <> ' ' AND NOT (CAST(twn_ch AS int) > '8' AND tdir = 'N')",
      // where: "tdir <> ' '", // priginal sql query
      outFields: ["twn_ch", "tdir"],
      returnDistinctValues: true,
      orderByFields: ["twn_ch", "tdir"],
    });
    try {
      const results = await townshipRangeSectionLayer.queryFeatures(townshipQuery);
      await addToSelect(results);
    } catch (err) {
      console.log('Township load failed: ', err);
    }
  })


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

  // Add the unique values to the
  // range selection element.
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

  // Add the unique values to the
  // section selection element.
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

  // when township changes, reset the other dropdowns.
  on(townshipSelect, "change", function (evt) {
    var type = evt.target.value;
    var i;
    for (i = rangeSelect.options.length - 1; i >= 0; i--) {
      rangeSelect.remove(i);
    }

    var rangeQuery = new Query({
      where: "twn_ch = '" + type.substr(0, 2) + "' AND tdir = '" + type.substr(2) + "'",
      outFields: ["rng_ch", "rdir"],
      returnDistinctValues: true,
      orderByFields: ["rng_ch", "rdir"]
    });
    return townshipRangeSectionLayer.queryFeatures(rangeQuery).then(addToSelect2);
  })

  // when range changes, reset the section dropdown.
  on(rangeSelect, "change", function (evt) {
    var type = evt.target.value;
    var j;
    for (j = sectionSelect.options.length - 1; j >= 0; j--) {
      sectionSelect.remove(j);
    }

    var e = document.getElementById("selectTownship");
    var strUser = e.options[e.selectedIndex].text;

    // TODO: Refactor this query to rmeove selectQuery.xxxxxxx    
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

  let infoPanelData = [];
  let layerList;

  // when mapView is ready, check that the services are online
  // if service is online, add to map
  // if service is offline, ignore
  mapView.when(async function () {

    // action definition for toggling labels on Certified Corner LABINS's sublayer
    function defineActions(event) {

      // The event object contains an item property.
      // is is a ListItem referencing the associated layer
      // and other properties. You can control the visibility of the
      // item, its title, and actions using this object.

      var item = event.item;

      if (item.title === "Certified Corners") {

        // An array of objects defining actions to place in the LayerList.
        // By making this array two-dimensional, you can separate similar
        // actions into separate groups with a breaking line.

        item.actionsSections = [
          [{
            title: "Toggle labels",
            className: "esri-icon-labels",
            id: "toggle-labels"
          }]
        ];
      }
    }

    const layersArr = [ /*GNISLayer, */ countyBoundariesLayer, labinsLayer, swfwmdLayer, CCCLLayer, townshipRangeSectionLayer];

    // wait for all services to be checked in the layersArr
    await checkServices(layersArr);

    // declare layerlist
    layerList = await new LayerList({
      view: mapView,
      container: "layersDiv",
      listItemCreatedFunction: defineActions

    });


    // status to watch if layerlist is on
    let layerlistStatus;
    on(dom.byId("desktopLayerlist"), "click", function (evt) {
      // if layerlist status != 1, add it to the map
      if (layerlistStatus != 1) {
        mapView.ui.remove(scaleBar);

        const altHead = `<div id="layerlist">
          <span class="glyphicon esri-icon-layers" aria-hidden="true" style="color: white; margin-right: 5px; margin-top: 5px; margin-left: 2px;"></span>
          <span id="infoSpan" class="panel-label"  style="color: white; margin-top: 5px;">Layerlist</span>
          <button id="closeLyrBtn" type="button" class="btn text-right" style="display: inline-block; background-color: transparent; float: right;">
            <span class="esri-icon esri-icon-close" style="color:white; display:inline-block; float:left;" aria-hidden="true"></span>
          </button>
          </div>
        `
        mapView.ui.add([layerList, scaleBar], "bottom-left");
        $("#layersDiv").prepend(altHead);

        document.getElementById('layerlist');
        const closebtn = document.getElementById('closeLyrBtn');
        on(closebtn, "click", function (event) {
          $("#layerlist").remove();
          mapView.ui.remove(layerList);
          layerlistStatus = 0;
        });
        layerlistStatus = 1;
      } else {
        $("#layerlist").remove();

        mapView.ui.remove(layerList);

        layerlistStatus = 0;
      }

    });

    // event to listen for action button on layerlist
    layerList.on("trigger-action", function (event) {
      // var labelToggle = $('.esri-layer-list__item-actions-menu-item');
      const targetLayer = layerList.operationalItems.items[2].children.items[2]
      // if the certified corners are visible and the mapView.scale is less than the minimum draw scale
      // enable toggling
      if ((targetLayer.visible === true) && (mapView.scale < minimumDrawScale)) {
        // if labels are not already visible, turn them on
        if ((targetLayer.layer.labelsVisible === false) || (targetLayer.layer.labelsVisible === undefined)) {
          // // handle focus toggle of action button on CCR sublayer

          targetLayer.layer.labelsVisible = true;
          targetLayer.layer.labelingInfo = [{
            labelExpression: "[blmid]",
            labelPlacement: "above-center",
            symbol: {
              type: "text", // autocasts as new TextSymbol()
              color: [0, 0, 255, 1],
              haloColor: [255, 255, 255],
              haloSize: 2,
              font: {
                size: 8
              }
            }
          }]
        } else { // if labels are visible, toggle them off
          targetLayer.layer.labelsVisible = false;
        }

      } else {
        // do nothing
      }
    });


    // when mapview is clicked:
    // clear graphics, check vis layers, identify layers
    on(mapView, "click", async function (event) {
      if ((mapView.scale < minimumDrawScale) && (coordExpand.expanded !== true)) {
        document.getElementById("mapViewDiv").style.cursor = "wait";
        mapView.graphics.removeAll();
        selectionLayer.graphics.removeAll();
        clearDiv('informationdiv');
        clearDiv('arraylengthdiv');
        infoPanelData = [];

        // look inside of layerList layers
        let layers = layerList.operationalItems.items

        // loop through layers
        for (layer of layers) {
          let visibleLayers
          // exclude geographic names layer from identify operation
          if (layer.title !== 'Geographic Names') {
            visibleLayers = await checkVisibleLayers(layer);



            // if there are visible layers returned
            if (visibleLayers.length > 0) {
              const task = new IdentifyTask(layer.layer.url)
              const params = await setIdentifyParameters(visibleLayers, "click", event);
              const identify = await executeIdentifyTask(task, params);

              // push each feature to the infoPanelData
              for (feature of identify.results) {
                feature.feature.attributes.layerName = feature.layerName;
                let result = feature.feature.attributes

                // make sure only certified corners with images are identified
                if (result.layerName !== 'Certified Corners' || result.is_image == 'Y') {
                  await infoPanelData.push(feature.feature);
                }
              }
            }
          }
        }
        if (infoPanelData.length > 0) {
          await queryInfoPanel(infoPanelData, 1);
          togglePanel();
          await goToFeature(infoPanelData[0]);
        } else { // if no features were found under the click
          $('#infoSpan').html('Information Panel - 0 features found.');
          $('#informationdiv').append('<p>This query did not return any features</p>');
        }
      }
      document.getElementById("mapViewDiv").style.cursor = "auto";
    });

  });

  // fetch all map services before loading to map
  // if service returns good, add service to map
  async function checkServices(layersArr) {
    // let layers = map.layers.items
    let layers = layersArr
    for (layer of layers) {
      try {
        // make request to server for layer in question
        const request = await fetch(layer.url)
        // if layer returns good, add to map
        map.add(layer);
      } catch (err) {
        // layer returns bad, not added to map, log error
        console.log(layer.title + " layer failed to be returned" + err);
      }
    }
  }

  async function checkVisibleLayers(service) {
    let visibleLayerIds = [];
    if (service.visible == true) {
      // find the currently visible layers/sublayers
      for (sublayer of service.children.items) {
        // if sublayer is visible, add to visibleLayerIds array
        if (sublayer.visible) {
          visibleLayerIds.push(sublayer.layer.id);
        }
      }
    }
    // return visibleLayerIds
    return visibleLayerIds;
  }

  async function setIdentifyParameters(visibleLayers, eventType, event) {
    // receive array of active visible layer with urls
    // Set the parameters for the Identify
    params = new IdentifyParameters();
    params.tolerance = 5;
    params.layerIds = visibleLayers;
    params.layerOption = "all";
    params.width = mapView.width;
    params.height = mapView.height;
    params.returnGeometry = true;
    params.returnFieldName = true;
    if (eventType == "click") {
      params.geometry = event.mapPoint
      params.mapExtent = mapView.extent;
    } else {
      params.geometry = event
      params.mapExtent = mapView.extent;
    }
    return params; // return parameter array 
  }

  async function executeIdentifyTask(tasks, params) {
    // take in tasks
    // take in parameters
    return tasks.execute(params)
  }

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
        if (response.features.length > 0) {
          return queryTask.execute(params);
        } else { // if no features were found
          $('#infoSpan').html('Information Panel - 0 features found.');
          $('#informationdiv').append('<p>This query did not return any features</p>');
          clearDiv('arraylengthdiv');
        }
      });
  }

  // go to first feature of the infopaneldata array
  function goToFeature(feature) {

    if (feature) {
      // Go to the selected parcel
      if (feature.geometry.type === "polygon" || feature.geometry.type === "polyline") {
        var ext = feature.geometry.extent;
        var cloneExt = ext.clone();

        // if current scale is greater than number, 
        // go to feature and expand extent by 1.75x
        if (mapView.scale > 18055.954822) {
          console.log(mapView.scale);
          console.log('going to a different scale')
          mapView.goTo({
            target: feature,
            extent: cloneExt.expand(1.75)
          });
        } else {
          // go to point at current scale
          mapView.goTo({
            target: feature,
            extent: feature.extent,
            scale: mapView.scale
          });
        }
        // Remove current selection
        selectionLayer.graphics.removeAll();
        // Highlight the selected parcel
        highlightGraphic = new Graphic(feature.geometry, highlightSymbol);
        selectionLayer.graphics.add(highlightGraphic);
      } else if (feature.geometry.type === "point") {
        // Remove current selection
        selectionLayer.graphics.removeAll();

        // Highlight the selected parcel
        highlightGraphic = new Graphic(feature.geometry, highlightPoint);
        selectionLayer.graphics.add(highlightGraphic);

        // TODO: NOt working properly, else if not being triggered
        if (mapView.scale > 18055.954822) {
          mapView.goTo({
            target: infoPanelData[0].geometry,
            zoom: 15
          });
        } else { // go to point at the current scale
          mapView.goTo({
            target: infoPanelData[0].geometry,
            scale: mapView.scale
          });
        }
      }
    }
  }


  //////////////////////////////////
  //// Search Widget Text Search ///
  //////////////////////////////////

  var searchWidget = new Search({
    container: "searchWidgetDiv",
    view: mapView,
    enableInfoWindow: false,
    popupEnabled: false,
    allPlaceholder: "Text search for NGS, DEP, and SWFWMD Data",
    sources: [{
      featureLayer: {
        url: labinsURL + '2',
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
      placeholder: "T07NR10W600700",
    }, {
      featureLayer: {
        url: labinsURL + '0',
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
        url: labinsURL + '3',
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
        url: labinsURL + '4',
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
        url: labinsURL + '8',
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

    // get geometry based on query results
    async function getGeometry(url, attribute, value) {
      console.log(value.toUpperCase());
      // modifies value to remove portions of the string in parentheses 
      value = value.replace(/ *\([^)]*\) */g, "")

      var task = new QueryTask({
        url: url
      });
      var query = new Query();
      query.returnGeometry = true;
      //query.outFields = ['*'];
      query.where = "Upper(" + attribute + ") LIKE '" + value.toUpperCase() + "%'"; //"ctyname = '" + value + "'" needs to return as ctyname = 'Brevard'

      console.log(task.execute(query));
      const results = task.execute(query);
      return results;
    }

    // data query by text
    async function multiTextQuerytask(url, attribute, queryStatement, idAttribute, idQueryStatement) {
      console.log('starting multiTextQueryTask');
      var whereStatement;

      if (queryStatement != '' || idQueryStatement != '') {
        whereStatement = "Upper(" + attribute + ') LIKE ' + "'%" + queryStatement.toUpperCase() + "%'" + ' or ' + "Upper(" + idAttribute + ') LIKE ' + "'%" + idQueryStatement.toUpperCase() + "%'";
      } else {
        console.log('No features found.');
      }

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
            $('#infoSpan').html('Information Panel - 0 features found.');
            $('#informationdiv').append('<p>This query did not return any features</p>');
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
        $('#infoSpan').html('Information Panel - 0 features found.');
        $('#informationdiv').append('<p>This query did not return any features</p>');
      }

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
            $('#infoSpan').html('Information Panel - 0 features found.');
            $('#informationdiv').append('<p>This query did not return any features</p>');
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
      createCountyDropdown(labinsURL + '/0', 'county');
      createQuadDropdown(labinsURL + '/0', 'quad');
      createTextBox('textQuery', 'Enter NGS Name or PID.');
      createSubmit();

      var countyDropdownAfter = document.getElementById('countyQuery');
      // county event listener
      query(countyDropdownAfter).on('change', function (e) {
        // cursor wait button
        document.getElementById("mapViewDiv").style.cursor = "wait";
        clearDiv('informationdiv');
        resetElements(countyDropdownAfter);
        infoPanelData = [];

        getGeometry(countyBoundariesURL + '/0', 'Upper(name)', e.target.value.replace(/[\s.-]/g, ''))
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(labinsURL + '/0', response)
              .then(function (response) {
                for (i = 0; i < response.features.length; i++) {
                  response.features[i].attributes.layerName = 'NGS Control Points';
                  infoPanelData.push(response.features[i]);
                }
                goToFeature(infoPanelData[0]);
                queryInfoPanel(infoPanelData, 1);
                togglePanel();
                document.getElementById("mapViewDiv").style.cursor = "auto";
              });
          });
      });

      // Query the quad dropdown
      var quadDropdownAfter = document.getElementById('quadQuery');

      query(quadDropdownAfter).on('change', function (e) {
        clearDiv('informationdiv');
        resetElements(quadDropdownAfter);
        infoPanelData = [];

        getGeometry(labinsURL + '/9', 'tile_name', e.target.value)
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(labinsURL + '/0', response)
              .then(function (response) {
                for (i = 0; i < response.features.length; i++) {
                  response.features[i].attributes.layerName = 'NGS Control Points';
                  infoPanelData.push(response.features[i]);
                }
                goToFeature(infoPanelData[0]);
                queryInfoPanel(infoPanelData, 1);
                togglePanel();
              });
          });
      });

      // Textbox Query of NGS Control Points
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

        multiTextQuerytask(labinsURL + '/0', 'pid', textValue, 'name', textValue)
          .then(function (response) {
            for (i = 0; i < response.features.length; i++) {
              response.features[i].attributes.layerName = 'NGS Control Points';
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
        textQueryQuerytask(labinsURL + '2', 'blmid', textValue)
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
      createCountyDropdown(labinsURL + '4', 'cname');
      createQuadDropdown(labinsURL + '4', 'tile_name');
      createTextBox('IDQuery', 'Enter an ID. Example: 1');
      createSubmit();

      var countyDropdownAfter = document.getElementById('countyQuery');

      query(countyDropdownAfter).on('change', function (e) {
        clearDiv('informationdiv');
        resetElements(countyDropdownAfter);
        infoPanelData = [];
        console.log(e.target.value);

        getGeometry(countyBoundariesURL + '0', 'name', e.target.value.replace(/[\s.-]/g, ''))
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(labinsURL + '4', response)
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

        getGeometry(labinsURL + '9', 'tile_name', e.target.value)
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(labinsURL + '4', response)
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

        textQueryQuerytask(labinsURL + '4', 'iden', textValue)
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
      createCountyDropdown(labinsURL + '3', 'countyname');
      createQuadDropdown(labinsURL + '3', 'quadname');
      createTextBox('textQuery', 'Enter Tide Station ID or Name');
      createSubmit();
      var countyDropdownAfter = document.getElementById('countyQuery');

      query(countyDropdownAfter).on('change', function (e) {
        clearDiv('informationdiv');
        resetElements(countyDropdownAfter);
        infoPanelData = [];

        getGeometry(countyBoundariesURL + '0', 'name', e.target.value.replace(/[\s.-]/g, ''))
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(labinsURL + '3', response)
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

        getGeometry(labinsURL + '9', 'tile_name', e.target.value)
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(labinsURL + '3', response)
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


        multiTextQuerytask(labinsURL + '3', 'id', textValue, 'name', textValue)

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

    } else if (layerSelection === 'Erosion Control Line') {
      clearDiv('parametersQuery');
      addDescript();
      createCountyDropdown(labinsURL + '8', 'county');
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
        getGeometry(countyBoundariesURL + '0', 'name', e.target.value.replace(/[\s.-]/g, ''))
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(labinsURL + '8', response)
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
        textQueryQuerytask(labinsURL + '8', 'ecl_name', inputAfter.value)
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
    console.log(mapView.scale);
    clearDiv('informationdiv');
    $('#numinput').val('');
    $('#arraylengthdiv').html('');
    $('#infoSpan').html('Information Panel');
  });

  // after a query typed into search bar
  // 
  searchWidget.on("search-complete", async function (event) {

    infoPanelData = [];
    console.log(event.results["0"].source);

    if (event.results["0"].source.locator) {
      // let native functionality work
    } else {
      // change the layername based on which layer is searched on (because the search query looks at )
      var layerName = event.results["0"].source.featureLayer.source.layerDefinition.name;
      event.results["0"].results["0"].feature.attributes.layerName = layerName;

      //clear content of information panel
      clearDiv('informationdiv');
      $('#numinput').val('');
      $('#arraylengthdiv').html('');
      $('#infoSpan').html('Information Panel');

      // push query results of search bar to information panel
      infoPanelData.push(event.results["0"].results["0"].feature);
      await queryInfoPanel(infoPanelData, 1);
      goToFeature(infoPanelData[0]);
      togglePanel();
    }
  });


  // set up alert for dynamically created zoom to feature buttons
  $(document).on('click', "button[name='zoom']", function () {

    console.log("Determining geometry type");

    goToFeature(infoPanelData[this.id - 1]);
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

  // if screen width under 992 pixels, put legend and layerlist widget button into navigation bar menu
  if (screen.availWidth < 992) {
    // Legend
    const legendWidget = new Legend({
      container: "legendDiv",
      view: mapView
    });

    mapView.ui.add(searchWidget, "top-right");


  } else {

    // if screen size normal, legend and layerlist will be buttons on nav bar
    const legendWidget = new Legend({
      container: "legendDiv",
      view: mapView
    });

    let legendStatus;
    on(dom.byId("desktopLegend"), "click", function (evt) {
      // if legend status != 1 (not currently being displayed), add it to the map

      if (legendStatus != 1) {

        const altHead = `
        <div id="legend" style="background-color:#315866; padding-bottom: 5px">
          <span class="glyphicon glyphicon-list-alt" aria-hidden="true" style="color: white; margin-right: 5px; margin-top: 5px; margin-left: 10px;"></span>
          <span id="infoSpan" class="panel-label"  style="color: white; margin-top: 5px;">Legend</span>
          <button id="closeLgdBtn" type="button" class="btn text-right" style="display: inline-block; background-color: transparent; float: right;">
            <span class="esri-icon esri-icon-close" style="color:white; display:inline-block; float:left;" aria-hidden="true"></span>
          </button>
        </div>
        `

        mapView.ui.remove(scaleBar);
        document.getElementById("legendDiv");
        mapView.ui.add([legendWidget, scaleBar], "bottom-left");
        $("#legendDiv").prepend(altHead);

        const closebtn = document.getElementById('closeLgdBtn');
        on(closebtn, "click", function (event) {
          $("#legend").remove();
          mapView.ui.remove(legendWidget);
          legendStatus = 0;
        });

        legendStatus = 1;
        console.log(legendStatus)
      } else {
        mapView.ui.remove(legendWidget);
        legendStatus = 0;
        console.log(legendStatus)
      }
    });

    //Coordinates widget
    var ccWidget = new CoordinateConversion({
      view: mapView,
      container: document.createElement("div"),
    });

    // Regular expression to find a number
    var numberSearchPattern = /-?\d+[\.]?\d*/;

    // Custom Projection: FL State Plane East 
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

    // Custom Projection: FL State Plane West
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

    // Custom Projection: FL State Plane North
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

    // adds an expand widget to the map that will house the ccWidget
    var coordExpand = new Expand({
      view: mapView,
      content: ccWidget.domNode,
      expandIconClass: "esri-icon-map-pin",
      expandTooltip: "Coordinates",
      collapseTooltip: "Coordinates",
      group: "left",
    });

    mapView.ui.add(coordExpand, "top-left");
  }

  // keeps track of the active widget between distance measurement and area measurement
  let activeWidget = null;

  // listen to when the distance button is clicked in order to activate the distanceMeasurement widget
  document.getElementById("distanceButton").addEventListener("click",
    function () {
      setActiveWidget(null);
      if (!this.classList.contains('active')) {
        setActiveWidget('distance');
        console.log('active widget is distance');
      } else {
        setActiveButton(null);
      }
    });

  // listen to when the area button is clicked in order to activate the areaMeasurement widget
  document.getElementById("areaButton").addEventListener("click",
    function () {
      setActiveWidget(null);
      if (!this.classList.contains('active')) {
        setActiveWidget('area');
      } else {
        setActiveButton(null);
      }
    });

  // function to switch active widget between areaMeasurement and distanceMeasurement widgets
  function setActiveWidget(type) {
    switch (type) {

      // if the distance measurement button was clicked
      case "distance":
        activeWidget = new DistanceMeasurement2D({
          view: mapView
        });

        // skip the initial 'new measurement' button
        activeWidget.viewModel.newMeasurement();
        mapView.ui.add(activeWidget, "bottom-left");
        setActiveButton(document.getElementById('distanceButton'));

        break;

        // if the area measurement button was clicked
      case "area":
        activeWidget = new AreaMeasurement2D({
          view: mapView,
        });

        // skip the initial 'new measurement' button
        activeWidget.viewModel.newMeasurement();

        // add the widget UI to the screen
        mapView.ui.add(activeWidget, "bottom-left");
        setActiveButton(document.getElementById('areaButton'));
        activeWidget.watch("viewModel.tool.active", async function (active) {
          if (active === false) {

            // if identify is checked, run a drill down identifyTask
            if (document.getElementById('measureIdentify').checked) {

              if (mapView.scale < minimumDrawScale) {
                document.getElementById("mapViewDiv").style.cursor = "wait";
                mapView.graphics.removeAll();
                selectionLayer.graphics.removeAll();
                clearDiv('informationdiv');
                clearDiv('arraylengthdiv');
                infoPanelData = [];

                // look inside of layerList layers
                let layers = layerList.operationalItems.items

                // loop through layers
                for (layer of layers) {
                  let visibleLayers
                  // exclude geographic names layer from identify operation
                  if (layer.title !== 'Geographic Names') {
                    visibleLayers = await checkVisibleLayers(layer);



                    // if there are visible layers returned
                    if (visibleLayers.length > 0) {
                      const task = new IdentifyTask(layer.layer.url)
                      const params = await setIdentifyParameters(visibleLayers, "polygon", activeWidget.viewModel.measurement.geometry);
                      const identify = await executeIdentifyTask(task, params);

                      // push each feature to the infoPanelData
                      for (feature of identify.results) {
                        feature.feature.attributes.layerName = feature.layerName;
                        let result = feature.feature.attributes

                        // make sure only certified corners with images are identified
                        if (result.layerName !== 'Certified Corners' || result.is_image == 'Y') {
                          await infoPanelData.push(feature.feature);
                        }
                      }
                    }
                  }
                }
                if (infoPanelData.length > 0) {
                  await queryInfoPanel(infoPanelData, 1);
                  togglePanel();
                  await goToFeature(infoPanelData[0]);
                } else { // if no features were found under the click
                  $('#infoSpan').html('Information Panel - 0 features found.');
                  $('#informationdiv').append('<p>This query did not return any features</p>');
                }
              }
              document.getElementById("mapViewDiv").style.cursor = "auto";

            }
          }
        });

        break;
      case null:
        if (activeWidget) {
          mapView.ui.remove(activeWidget);
          activeWidget.destroy();
          activeWidget = null;
        }
        break;
    }
  }

  function setActiveButton(selectedButton) {
    // focus the view to activate keyboard shortcuts for sketching
    mapView.focus();
    var elements = document.getElementsByClassName("active");
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove("active");
    }
    if (selectedButton) {
      selectedButton.classList.add("active");
    }
  }



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

  // Home Button
  var home = new Home({
    view: mapView
  });
  mapView.ui.add(home, "top-left");

  // Locate Button
  var locateBtn = new Locate({
    view: mapView
  });
  mapView.ui.add(locateBtn, "top-left");

  // Clear Button
  var clearBtn = document.getElementById("clearButton");
  mapView.ui.add(clearBtn, "top-left");

});