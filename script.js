require([
  // ArcGIS
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/MapImageLayer",
  "esri/layers/FeatureLayer",
  "esri/tasks/QueryTask",
  "esri/tasks/support/Query",
  "esri/geometry/geometryEngine",
  "esri/geometry/Extent",
  "esri/geometry/Point",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/tasks/IdentifyTask",
  "esri/tasks/support/IdentifyParameters",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/tasks/Locator",
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
  "esri/widgets/ScaleBar",
  "esri/widgets/Home",
  "esri/widgets/Locate",
  "esri/widgets/Expand",
  "esri/widgets/DistanceMeasurement2D",
  "esri/widgets/AreaMeasurement2D",
  "esri/core/watchUtils",
  "dojo/on",
  "dojo/dom",
  "dojo/dom-class",
  "dojo/dom-construct",
  "dojo/dom-geometry",
  "dojo/keys",
  "dojo/json",
  "dojo/query",
  "dojo/_base/Color",

  // Calcite Maps ArcGIS Support
  "calcite-maps/calcitemaps-arcgis-support-v0.6",
  "calcite-maps/calcitemaps-v0.6",

  // Bootstrap
  "bootstrap/Collapse",
  "bootstrap/Dropdown",

  "dojo/domReady!"
], function (
  Map,
  MapView,
  MapImageLayer,
  FeatureLayer,
  QueryTask,
  Query,
  geometryEngine,
  Extent,
  Point,
  GraphicsLayer,
  Graphic,
  IdentifyTask,
  IdentifyParameters,
  SimpleFillSymbol,
  SimpleLineSymbol,
  Locator,
  SpatialReference,
  CoordinateConversion,
  Format,
  Conversion,
  Basemaps,
  Search,
  Legend,
  LayerList,
  Print,
  ScaleBar,
  Home,
  Locate,
  Expand,
  DistanceMeasurement2D,
  AreaMeasurement2D,
  watchUtils, on, dom, domClass, domConstruct, domGeom, keys, JSON, query, Color,
  CalciteMapsArcGISSupport) {

  var minimumDrawScale = 95000;
  var extents = [];

     function buildNGSRenderer() {

      const default_symbol = {
          type: "simple-marker",
          size: 8,
          color: 'black',
          style: 'square',
          outline: {
              width: 0
          }
      };

      function buildValueInfos() {

          const valueInfos = [];
          const styles = ['Horizontal', 'Vertical', 'Hor. & Ver.', 'Not Classified'];
          styles.forEach(function (style) {
              const info = {
                  value: style,
                  // Make a shallow copy so that symbols do not influence one another
                  symbol: {...default_symbol}
              };
              switch (style) {
                  case 'Vertical':
                      info.symbol.color = '#009933';
                      info.symbol.style = 'square';
                      valueInfos.push(info);
                      break;
                  case 'Horizontal':
                      info.symbol.color = '#FF00CA';
                      info.symbol.style = 'triangle';
                      valueInfos.push(info);
                      break;
                  case 'Hor. & Ver.':                                
                      info.symbol.outline = {
                          color: '#FF6666',
                          width: '4px',
                          cap: 'square'
                      };
                      info.symbol.style = 'cross';
                      valueInfos.push(info);
                      break; 
                  case 'Not Classified':
                      info.symbol.color = '#9999FF';
                      info.symbol.style = 'circle';
                      valueInfos.push(info);
                      break;
              }
          });
          return valueInfos;
      }

      const customRenderer = {
        type: "unique-value",
        field: "pos_srce",
        field2: "vert_srce",
        fieldDelimiter: ",",
        uniqueValueInfos: buildValueInfos(),
        defaultSymbol: default_symbol,
        defaultLabel: 'Unknown',
        legendOptions: {
          title: 'Source'
        },
        valueExpression: `
          var c = Concatenate([$feature.pos_srce, $feature.vert_srce], ',');
          When(Find(c, "SCALED,POSTED SCALED,RESET SCALED,ADJUSTED NO CHECK,POSTED NO CHECK,RESET NO CHECK,ADJUSTED HD_HELD1,POSTED HD_HELD1,RESET HD_HELD1,ADJUSTED HD_HELD2,POSTED HD_HELD2,RESET HD_HELD2,ADJUSTED") != -1, 'Vertical',
          Find(c, "ADJUSTED,GPS OBS ADJUSTED,VERTCON ADJUSTED,SCALED ADJUSTED,LEVELING ADJUSTED,  ADJUSTED,NOT PUB ADJUSTED,VERT ANG") != -1, 'Horizontal',
          Find(c, "ADJUSTED,POSTED ADJUSTED,RESET ADJUSTED,ADJUSTED") != -1, 'Hor. & Ver.',
          Find(c, "SCALED,NOT PUB SCALED,VERTCON NO CHECK,  NO CHECK,NOT PUB NO CHECK,SCALED NO CHECK,VERTCON NO CHECK,GPS OBS HD_HELD1,NOT PUB HD_HELD1,VERTCON HD_HELD2,NOT PUB HD_HELD2,VERTCON") != -1, 'Not Classified',
          'default');
        `
      };

  return customRenderer;
  }

  const ngsLayerURL = "https://services2.arcgis.com/C8EMgrsFcRFL6LrL/ArcGIS/rest/services/ngs_datasheets/FeatureServer/0";
  const ngsLayer = new FeatureLayer({
    url: ngsLayerURL,
    outFields: ["pos_srce", "vert_srce"],
    title: "NGS Control Points",
    definitionExpression: "STATE = 'FL'",
    renderer: buildNGSRenderer(),
    minScale: minimumDrawScale
  });

  function haloLabelInfo(labelExpr, labelColor) {
    return [{
      labelExpression: labelExpr,
      labelPlacement: "above-center",
      symbol: {
        type: "text",
        color: labelColor,
        haloColor: [255, 255, 255],
        haloSize: 2,
        font: {
          size: 8
        }
      }
    }];
  }

  const countiesRenderer = {
    type: "simple",
    symbol: {
      type: "simple-fill",
      style: "none",
      color: "none",
      outline: {
        style: "dash-dot",
        width: 1,
        color: "dimgray"
      }
    }
  };

  var countyBoundariesURL = "https://maps.freac.fsu.edu/arcgis/rest/services/FREAC/County_Boundaries/MapServer/";
  var countyBoundariesLayer = new MapImageLayer({
    url: countyBoundariesURL,
    title: "County Boundaries",
    minScale: 2000000,
    sublayers: [{
      id: 0,
      title: "County Boundaries",
      visible: true,
      popupEnabled: false,
      renderer: countiesRenderer
    }]
  });

  var labinsURL = "https://maps.freac.fsu.edu/arcgis/rest/services/LABINS/LABINS_Data/MapServer/";
  var labinsLayer = new MapImageLayer({
    url: labinsURL,
    sublayers: [{
      id: 16,
      title: "Soils June 2012 - Dept. of Agriculture",
      visible: false,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 15,
      title: "Hi-Res Imagery Grid State Plane East",
      visible: true,
      popupEnabled: false,
      minScale: minimumDrawScale,
      labelingInfo: haloLabelInfo("[spe_id]", [230, 76, 0, 255]),
      labelsVisible: false
    }, {
      id: 14,
      title: "Hi-Res Imagery Grid: State Plane North",
      visible: true,
      popupEnabled: false,
      minScale: minimumDrawScale,
      labelingInfo: haloLabelInfo("[spn_id]", [230, 76, 0, 255]),
      labelsVisible: false
    }, {
      id: 13,
      title: "Hi-Res Imagery Grid: State Plane West",
      visible: true,
      popupEnabled: false,
      minScale: minimumDrawScale,
      labelingInfo: haloLabelInfo("[spw_id]", [230, 76, 0, 255]),
      labelsVisible: false
    }, {
      id: 12,
      title: "Parcels",
      visible: false,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 11,
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
      id: 10,
      title: "Township-Range-Section",
      visible: true,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 9,
      title: "Township-Range",
      visible: true,
      popupEnabled: false,
      labelsVisible: true,
      // Set label specs for township-range
      labelingInfo: [{
        labelExpression: "[tr_dissolve]",
        labelPlacement: "always-horizontal",
        symbol: {
          type: "text",
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
      id: 8,
      title: "USGS Quads",
      visible: false,
      popupEnabled: false,
      minScale: minimumDrawScale
    }, {
      id: 7,
      title: "Erosion Control Line",
      minScale: 4000000,
      visible: true,
      popupEnabled: false
    }, {
      id: 6,
      title: "R-Monuments",
      visible: true,
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
      minScale: minimumDrawScale,
      labelingInfo: haloLabelInfo("[blmid]", [0, 0 , 255, 255]),
      labelsVisible: false
    }, {
      id: 1,
      title: "Preliminary NGS Points",
      visible: false,
      popupEnabled: false,
      minScale: minimumDrawScale
    }]
  });

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
  var townshipRangeSectionURL = "https://maps.freac.fsu.edu/arcgis/rest/services/LABINS/LABINS_Data/MapServer/10"
  var townshipRangeSectionLayer = new FeatureLayer({
    url: townshipRangeSectionURL,
    outFields: ["twn_ch", "rng_ch", "sec_ch"],
    title: "Section Lines",
    visible: false,
    listMode: "hide",
    popupEnabled: false
  });

  var CCCLURL = "https://ca.dep.state.fl.us/arcgis/rest/services/OpenData/COASTAL_ENV_PERM/MapServer/2"
  var CCCLLayer = new FeatureLayer({
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

    // Process the bookmarkJSON
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

    // Process the local storage bookmarks
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

  function resetElements(currentElement, trs = true) {
    let doNotSelect = "#" + currentElement.id + ", #selectLayerDropdown";
    doNotSelect = trs ? doNotSelect : doNotSelect + ", .trs" ;
    
    $("select").not(doNotSelect).each(function () {
      this.selectedIndex = 0;
    });
  }   


  /////////////////////////////
  /// Dropdown Select Panel ///
  /////////////////////////////

  // query layer and populate a dropdown
  function buildSelectPanel(url, attribute, zoomParam, panelParam, ngs=false) {
    
    let whereClause = ngs ? attribute + " IS NOT NULL AND STATE = 'FL'" : attribute + " IS NOT NULL";

    var task = new QueryTask({
      url: url
    });

    var params = new Query({
      where: whereClause,
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
    bufferLayer.graphics.removeAll();
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
    // Array to store polygons in
    var multiPolygonGeometries = [];
    for (i = 0; i < response.features.length; i++) {
      multiPolygonGeometries.push(response.features[i].geometry);
    }
    var union = await geometryEngine.union(multiPolygonGeometries);
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
        var multiPolygonGeometries = [];
        for (i = 0; i < response.features.length; i++) {
          multiPolygonGeometries.push(response.features[i].geometry);
        }
        var union = geometryEngine.union(multiPolygonGeometries);
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

  function zoomToTRFeature(results) {
    console.log(results.features);
    mapView.goTo(results.features);
    bufferLayer.graphics.removeAll();
    selectionLayer.graphics.removeAll();
    graphicArray = [];
    for (feature of results.features) {
      highlightGraphic = new Graphic(feature.geometry, highlightSymbol);
      graphicArray.push(highlightGraphic);
    }
    selectionLayer.graphics.addMany(graphicArray);
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
  buildSelectPanel(labinsURL + '8', "tile_name", "Zoom to a Quad", "selectQuadPanel");

  //Zoom to feature
  query("#selectQuadPanel").on("change", function (e) {
    resetElements(document.getElementById('selectQuadPanel'));
    return zoomToFeature(labinsURL + '8', e.target.value, "tile_name");
  });

  //Build City Dropdown panel
  buildSelectPanel(labinsURL + '11', "name", "Zoom to a City", "selectCityPanel");

  //Zoom to feature
  query("#selectCityPanel").on("change", function (e) {
    resetElements(document.getElementById('selectCityPanel'));
    return zoomToFeature(labinsURL + '11', e.target.value, "name");
  });

  ////////////////////////////////////////////////
  //// Zoom to Township/Section/Range Feature ////
  ////////////////////////////////////////////////

  const townshipSelect = dom.byId("selectTownship");
  const rangeSelect = dom.byId("selectRange");
  const sectionSelect = dom.byId("selectSection");

  // when mapView is ready, build the first dropdown for township selection
  mapView.when(async function () {
    
    const townshipQuery = new Query({
      where: "tdir <> ' ' AND NOT (CAST(twn_ch AS int) > '8' AND tdir = 'N')",
      outFields: ["twn_ch", "tdir"],
      returnDistinctValues: true,
      orderByFields: ["twn_ch", "tdir"]
    });

    const rangeQuery = new Query({
      where: "rdir <> ' '",
      outFields: ["rng_ch", "rdir"],
      returnDistinctValues: true,
      orderByFields: ["rng_ch", "rdir"]
    })
    try {
      const townshipResults = await townshipRangeSectionLayer.queryFeatures(townshipQuery);
      const rangeResults = await townshipRangeSectionLayer.queryFeatures(rangeQuery);
      await buildTownshipDropdown(townshipResults);
      await buildRangeDropdown(rangeResults);
      console.log(townshipSelect.value);
      console.log(rangeSelect.value);
    } catch (err) {
      console.log('Township load failed: ', err);
    }
  })

  // Add the unique values to the subregion
  // select element. This will allow the user
  // to filter states by subregion.
  function buildTownshipDropdown(values) {
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
  function buildRangeDropdown(values) {
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
  function buildSectionDropdown(values) {
    var option = domConstruct.create("option");
    option.text = "Zoom to a Section";
    sectionSelect.add(option);

    values.features.forEach(function (value) {
      var option = domConstruct.create("option");
      option.text = value.attributes.sec_ch;
      sectionSelect.add(option);
    });
  }

  // function handleResults(results) {
  //   new Promise(
  //     function (resolve, reject) {
  //         if (results) {
  //           console.log(results);
            
  //           return Promise.resolve(results); // fulfilled
  //           return results;
  //         } else {
  //             var reason = new Error('This is an invalid Township-Range combination');
  //             reject(reason); // reject
  //             throw reason;
  //         }
  //     });
  // }

  const handleResults = results => {
    if (results.features.length > 0) {
      console.log(results);
      
      return results;
    } else {
        console.log('reject!');
        
        var reason = new Error('This is an invalid Township-Range combination');
        throw reason;
    }
  }

  // when township changes, reset the other dropdowns.
  on(townshipSelect, "change", function (evt) {
    resetElements(townshipSelect, false);
    var type = evt.target.value;
    var i;
    
    if (rangeSelect.value !== "Zoom to a Range") { // check to see if combo is valid
      const rangeValue = rangeSelect.value;
      const TRQuery = new Query({
        where: "twn_ch = '" + type.substr(0, 2) + "' AND tdir = '" + type.substr(2) + "' AND rng_ch = '" + rangeValue.substr(0, 2) + "' AND rdir = '" + rangeValue.substr(2) + "'",
        returnGeometry: true
      });
      townshipRangeSectionLayer.queryFeatures(TRQuery)
      .then(results => handleResults(results))
      .then(results => {
        console.log({results});
        zoomToTRFeature(results)
      })
      .catch((error) => {
        console.error(error);
      });
    }
  })

  // when range changes, reset the section dropdown.
  on(rangeSelect, "change", function (evt) {
    resetElements(rangeSelect, false);
    var type = evt.target.value;
    var i;
    
    if (townshipSelect.value !== "Zoom to a Township") { // check to see if combo is valid
      const townshipValue = townshipSelect.value;
      const TRQuery = new Query({
        where: "rng_ch = '" + type.substr(0, 2) + "' AND rdir = '" + type.substr(2) + "' AND twn_ch = '" + townshipValue.substr(0, 2) + "' AND tdir = '" + townshipValue.substr(2) + "'",
        returnGeometry: true
      });
      townshipRangeSectionLayer.queryFeatures(TRQuery)
      .then(results => handleResults(results))
      .then(results => {
        console.log({results});
        zoomToTRFeature(results)
      })
      .catch((error) => {
        console.error(error);
      });
    }
  });

  var querySection = dom.byId("selectSection");
  on(querySection, "change", function (e) {
    resetElements(sectionSelect, false);
    var type = e.target.value;
    zoomToSectionFeature(townshipRangeSectionURL, type, "sec_ch");
  });

  // var queryRange = dom.byId("selectRange");
  // on(queryRange, "change", function (e) {
  //   var type = e.target.value;
  //   zoomToTRFeature(townshipRangeSectionURL, type, "rng_ch");
  // });

  let infoPanelData = [];
  let layerList;

  // when mapView is ready, check that the services are online
  // if service is online, add to map
  // if service is offline, ignore
  mapView.when(async function () {

    // Add label toggles in Layerlist widget
    function defineActions(event) {
      if (["Certified Corners", "Hi-Res Imagery Grid State Plane East",
       "Hi-Res Imagery Grid: State Plane North", "Hi-Res Imagery Grid: State Plane West"].includes(event.item.title)) {
        event.item.actionsSections = [
          [{
            title: "Toggle labels",
            className: "esri-icon-labels",
            id: "toggle-labels"
          }]
        ];
      }
    }

    // wait for all services to be checked in the layersArr
    const layersArr = [countyBoundariesLayer, labinsLayer, ngsLayer, swfwmdLayer, CCCLLayer, townshipRangeSectionLayer];
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

        // custom header to display a header and close button
        const header = `
        <div id="layerlistHeader" style="background-color:#315866; position: sticky; top: 0; z-index: 999; padding-top: 1px;">
          <span class="glyphicon esri-icon-layers" aria-hidden="true" style="color: white; margin-right: 5px; margin-top: 5px; margin-left: 2px;"></span>
          <span id="infoSpan" class="panel-label"  style="color: white; margin-top: 5px;">Layerlist</span>
          <button id="closeLyrBtn" type="button" class="btn text-right" style="display: inline-block; background-color: transparent; float: right;">
            <span class="esri-icon esri-icon-close" style="color:white; display:inline-block; float:left;" aria-hidden="true"></span>
          </button>
        </div>
        `
        mapView.ui.add([layerList, scaleBar], "bottom-left");
        // add layerlist header to beginning of div
        $("#layersDiv").prepend(header);

        const closebtn = document.getElementById('closeLyrBtn');
        on(closebtn, "click", function (event) {
          $("#layerlistHeader").remove();
          mapView.ui.remove(layerList);
          layerlistStatus = 0;
        });
        layerlistStatus = 1;
      } else {
        $("#layerlistHeader").remove();
        mapView.ui.remove(layerList);
        layerlistStatus = 0;
      }
    });

    // Toggle labels from LayerList widget
    layerList.on("trigger-action", function (event) {
      if (mapView.scale < minimumDrawScale) {
        event.item.layer.labelsVisible = !event.item.layer.labelsVisible;
      }
    });

    // when mapview is clicked:
    // clear graphics, check vis layers, identify layers
    on(mapView, "click", async function (event) {
      if (screen.availWidth < 992) {
        identifyTaskFlow(event, false, true);
      } else {
        identifyTaskFlow(event, coordExpand.expanded !== true, false);
      }
    });
  });

  async function identifyTaskFlow(event, coordExpanParam, mobileView) {
    if ((mapView.scale < minimumDrawScale) && (coordExpanParam || mobileView)) {
      document.getElementById("mapViewDiv").style.cursor = "wait";
      mapView.graphics.removeAll();
      selectionLayer.graphics.removeAll();
      clearDiv('informationdiv');
      infoPanelData = [];

      // look inside of layerList layers
      let layers = layerList.operationalItems.items
      // loop through layers
      for (layer of layers) {
        let visibleLayers;
        // exclude geographic names layer from identify operation
        if (layer.title !== 'Geographic Names') {
          visibleLayers = await checkVisibleLayers(layer);
          // if there are visible layers returned
          if (visibleLayers.length > 0) {
            if (layer.title === 'NGS Control Points') {
              const query = ngsLayer.createQuery();
              query.geometry = mapView.toMap(event);
              query.distance = 30;
              query.units = 'meters';
              query.returnGeometry = true;
              query.outFields = ['NAME', 'DEC_LAT', 'DEC_LON', 'COUNTY', 'DATA_SRCE', 'PID'];
              query.where = "STATE = 'FL'";
              await ngsLayer.queryFeatures(query)
                .then(function (response){
                  for (feature in response.features) {
                    const control_point = response.features[feature];
                    control_point.attributes.layerName = control_point.layer.title;
                    infoPanelData.push(control_point);
                  }
                });
            } else {
              const task = new IdentifyTask(layer.layer.url)
              const params = await setIdentifyParameters(visibleLayers, "click", event);
              var identify = await executeIdentifyTask(task, params);
              // push each feature to the infoPanelData
              for (feature of identify.results) {
                feature.feature.attributes.layerName = feature.layerName;
                let result = feature.feature.attributes
                // make sure only certified corners with images are identified
                if (result.layerName !== 'Certified Corners' || result.is_image === 'Y') {
                  await infoPanelData.push(feature.feature);
                }
              }
            }
          }
        }
      }
      if (infoPanelData.length > 0) {
        await queryInfoPanel(infoPanelData, 1, event);
        togglePanel();
        await goToFeature(infoPanelData[0], button=false);
      } else {
        $('#infoSpan').html('Information Panel - 0 features found.');
        $('#informationdiv').append('<p>This query did not return any features</p>');
      }
    }
    document.getElementById("mapViewDiv").style.cursor = "auto";
  }

  // fetch all map services before loading to map
  // if service returns good, add service to map
  async function checkServices(layersArr) {
    let layers = layersArr
    for (layer of layers) {
      try {
        // make request to server for layer in question
        const request = await fetch(layer.url)
        // if layer returns good, add to map
        map.add(layer);
      } catch (err) {
        // layer returns bad, not added to map, log error
        console.error(layer.title + " layer failed to be returned: " + err);
      }
    }
  }

  async function checkVisibleLayers(service) {
    let visibleLayerIds = [];
    if (service.visible == true) {

      if (service.layer.type === 'feature') { // check which layer type
        visibleLayerIds.push(service.layer.layerId);

      } else if (service.layer.type === 'map-image') {
        // find the currently visible layers/sublayers
        for (sublayer of service.children.items) {
          // if sublayer is visible, add to visibleLayerIds array
          if (sublayer.visible) {
            visibleLayerIds.push(sublayer.layer.id);
          }
        }
      }
    }
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
    return params;
  }

  async function executeIdentifyTask(tasks, params) {
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
        } else {
          $('#infoSpan').html('Information Panel - 0 features found.');
          $('#informationdiv').append('<p>This query did not return any features</p>');
        }
      });
  }

  // go to first feature of the infopaneldata array
  function goToFeature(feature, button=true) {

    if (feature) {
      // Go to the selected parcel
      // if (feature.geometry.type === "polygon") {
      // do nothing
      // desired condition is to not zoom, 
      // but that requirement may change in the future
      if (feature.geometry.type === "polyline" || (feature.geometry.type === "polygon" && button)) {
        var ext = feature.geometry.extent;
        var cloneExt = ext.clone();
        // if current scale is greater than number, 
        // go to feature and expand extent by 1.75x
        if (mapView.scale > 18055.954822) {
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

        // TODO: Not working properly, else if not being triggered
        if (mapView.scale > 18055.954822) {
          mapView.goTo({
            target: feature.geometry,
            zoom: 15
          });
        } else { // go to point at the current scale
          mapView.goTo({
            target: feature.geometry,
            zoom: mapView.zoom
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
    popupEnabled: false,
    includeDefaultSources: false,
    allPlaceholder: "Search for data or an address",
    sources: [{
      name: "Certified Corners",
      layer: new FeatureLayer({
        url: labinsLayer.findSublayerById(2).url,
        name: 'Certified Corners'
      }),
      outFields: ["blmid", "tile_name", "image1", "image2", "quad_num"],
      searchFields: ["blmid", "tile_name", "quad_num"],
      suggestionTemplate: "BLMID: {blmid}<br>Quad: {tile_name}",
      exactMatch: false,
      resultSymbol: highlightPoint,
      placeholder: "Search by Certified Corner",
    }, {
      name: "NGS Control Points",
      layer: new FeatureLayer({
        url: ngsLayerURL,
        name: "NGS Control Points",
        definitionExpression: "STATE = 'FL'"
      }),
      outFields: ["DEC_LAT", "DEC_LON", "PID", "COUNTY", "DATA_SRCE", "NAME"],
      searchFields: ["NAME"],
      suggestionTemplate: "PID: {PID}<br>Name: {NAME}<br>County: {COUNTY}",
      exactMatch: false,
      resultSymbol: highlightPoint,
      placeholder: "Search by NGS Control Point",
    }, {
      name: "Tide Stations",
      layer: new FeatureLayer({
        url: labinsLayer.findSublayerById(3).url,
        name: "Tide Stations"
      }),
      outFields: ["id", "name", "countyname", "quadname", "status"],
      searchFields: ["id", "name"],
      suggestionTemplate: "ID: {id}<br>Name: {name}<br>County: {countyname}",
      exactMatch: false,
      resultSymbol: highlightPoint,
      placeholder: "Search by Tide Station",
    }, {
      name: "Tide Interpolation Points",
      layer: new FeatureLayer({
        url: labinsLayer.findSublayerById(4).url,
        name: "Tide Interpolation Points"
      }),
      outFields: ["iden", "cname", "tile_name", "method", "station1", "station2"],
      searchFields: ["iden", "station1", "station2"],
      suggestionTemplate: "ID: {iden}<br>Station: {station1}<br>County: {cname}",
      exactMatch: false,
      resultSymbol: highlightPoint,
      placeholder: "Search by Tide Interpolation Point",
    }, {
      name: "Erosion Control Line",
      layer: new FeatureLayer({
        url: labinsLayer.findSublayerById(7).url,
        name: "Erosion Control Line"
      }),
      outFields: ["ecl_name", "county", "mhw", "location"],
      searchFields: ["ecl_name"],
      suggestionTemplate: "ECL Name: {ecl_name}<br>County: {county}",
      exactMatch: false,
      resultSymbol: highlightLine,
      placeholder: "Search by ECL",
    }, {
      name: "Survey Benchmarks",
      layer: new FeatureLayer({
        url: swfwmdURL,
        name: "Survey Benchmarks"
      }),
      outFields: ["BENCHMARK_NAME", "FILE_NAME"],
      searchFields: ["BENCHMARK_NAME"],
      suggestionTemplate: "Name: {BENCHMARK_NAME}",
      exactMatch: false,
      resultSymbol: highlightPoint,
      placeholder: "Search by Survey Benchmark",
    }, {
      locator: new Locator({
        url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
      }),
      singleLineFieldName: "SingleLine",
      name: "Addresses & Points of Interest",
      placeholder: "Search by Address",
      maxResults: 1,
      countryCode: "US",
      filter: {
        // Extent of Florida
        geometry: new Extent({
          xmin : -87.8,
          ymin : 24.4,
          xmax : -79.8,
          ymax : 31.2,
          "spatialReference" : {"wkid" : 4326}
        })
      }
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
  query("#selectLayerDropdown").on("change", function (event) {

    // get geometry based on query results
    async function getGeometry(url, attribute, value) {
      // modifies value to remove portions of the string in parentheses 
      value = value.replace(/ *\([^)]*\) */g, "")

      var task = new QueryTask({
        url: url
      });
      var query = new Query();
      query.returnGeometry = true;
      query.where = "Upper(" + attribute + ") LIKE '" + value.toUpperCase() + "%'"; //"ctyname = '" + value + "'" needs to return as ctyname = 'Brevard'

      const results = task.execute(query);
      return results;
    }

    // data query by text
    async function multiTextQuerytask(url, attribute, queryStatement, idAttribute, idQueryStatement, ngs=false) {
      var whereStatement;
      if (queryStatement != '' || idQueryStatement != '') {
        whereStatement = "(Upper(" + attribute + ') LIKE ' + "'%" + queryStatement.toUpperCase() + "%'" + ' or ' + "Upper(" + idAttribute + ') LIKE ' + "'%" + idQueryStatement.toUpperCase() + "%')";
      }
      if (ngs) {
        whereStatement += " AND STATE = 'FL'";
      }

      var queryTask = new QueryTask({
        url: url
      });
      var params = new Query({
        where: whereStatement,
        returnGeometry: true,
        // possibly could be limited to return only necessary outfields
        outFields: ['*']
      });

      return queryTask.execute(params)
        .then(function (response) {
          if (response.features.length > 0) {
            return queryTask.execute(params);
          } else {
            togglePanel();
            $('#infoSpan').html('Information Panel - 0 features found.');
            $('#informationdiv').append('<p>This query did not return any features</p>');
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
        outFields: ['*']
      });
      return queryTask.execute(params)
        .then(function (response) {
          if (response.features.length > 0) {
            return queryTask.execute(params);
          } else {
            togglePanel();
            $('#infoSpan').html('Information Panel - 0 features found.');
            $('#informationdiv').append('<p>This query did not return any features</p>');
          }
        });
    }

    function createCountyDropdown(attributeURL, countyAttribute, ngs=false) {
      var countyDropdown = document.createElement('select');
      countyDropdown.setAttribute('id', 'countyQuery');
      countyDropdown.setAttribute('class', 'form-control');
      document.getElementById('parametersQuery').appendChild(countyDropdown);
      buildSelectPanel(attributeURL, countyAttribute, "Select a County", "countyQuery", ngs);
    }

    function createQuadDropdown(attributeURL, quadAttribute, ngs=false) {
      var quadDropdown = document.createElement('select');
      quadDropdown.setAttribute('id', 'quadQuery');
      quadDropdown.setAttribute('class', 'form-control');
      document.getElementById('parametersQuery').appendChild(quadDropdown);
      buildSelectPanel(attributeURL, quadAttribute, "Select a Quad", "quadQuery", ngs)
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

    var layerSelection = event.target.value;
    if (layerSelection === "Select Layer") {
      clearDiv();

    } else if (layerSelection === 'NGS Control Points') {
      // clear the div of the previous input
      clearDiv('parametersQuery');
      // add dropdown, input, and submit elements
      addDescript();
      createCountyDropdown(ngsLayerURL, 'COUNTY', ngs=true);
      createQuadDropdown(ngsLayerURL, 'QUAD', ngs=true);
      createTextBox('textQuery', 'Enter NGS Name or PID.');
      createSubmit();

      var countyDropdownAfter = document.getElementById('countyQuery');
      // county event listener
      query(countyDropdownAfter).on('change', function (event) {
        // cursor wait button
        document.getElementById("mapViewDiv").style.cursor = "wait";
        clearDiv('informationdiv');
        resetElements(countyDropdownAfter);
        infoPanelData = [];

        getGeometry(countyBoundariesURL + '/2', 'Upper(name)', event.target.value.replace(/[\s.-]/g, ''))
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(ngsLayerURL, response)
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

      query(quadDropdownAfter).on('change', function (event) {
        clearDiv('informationdiv');
        resetElements(quadDropdownAfter);
        infoPanelData = [];
        getGeometry(labinsURL + '/8', 'tile_name', event.target.value)
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(ngsLayerURL, response)
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
      query(submitAfter).on('click', function (event) {
        clearDiv('informationdiv');
        infoPanelData = [];
        var textValue = document.getElementById('textQuery').value;
        multiTextQuerytask(ngsLayerURL, 'PID', textValue, 'NAME', textValue, ngs=true)
          .then(function (response) {
            for (i = 0; i < response.features.length; i++) {
              response.features[i].attributes.layerName = 'NGS Control Points';
              infoPanelData.push(response.features[i]);
            }
            goToFeature(infoPanelData[0]);
            queryInfoPanel(infoPanelData, 1, event);
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
      query(submitAfter).on('click', function (event) {
        clearDiv('informationdiv');
        infoPanelData = [];
        var textValue = document.getElementById('IDQuery').value;
        textQueryQuerytask(labinsURL + '2', 'blmid', textValue)
          .then(function (response) {
            for (i = 0; i < response.features.length; i++) {
              response.features[i].attributes.layerName = 'Certified Corners';
              infoPanelData.push(response.features[i]);
            }
            goToFeature(infoPanelData[0]);
            queryInfoPanel(infoPanelData, 1, event);
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
      query(countyDropdownAfter).on('change', function (event) {
        clearDiv('informationdiv');
        resetElements(countyDropdownAfter);
        infoPanelData = [];

        getGeometry(countyBoundariesURL + '2', 'name', event.target.value.replace(/[\s.-]/g, ''))
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

      query(quadDropdownAfter).on('change', function (event) {
        clearDiv('informationdiv');
        resetElements(quadDropdownAfter);
        infoPanelData = [];

        getGeometry(labinsURL + '8', 'tile_name', event.target.value)
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
      query(submitAfter).on('click', function (event) {
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
      query(countyDropdownAfter).on('change', function (event) {
        clearDiv('informationdiv');
        resetElements(countyDropdownAfter);
        infoPanelData = [];

        getGeometry(countyBoundariesURL + '2', 'name', event.target.value.replace(/[\s.-]/g, ''))
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
      query(quadDropdownAfter).on('change', function (event) {
        clearDiv('informationdiv');
        resetElements(quadDropdownAfter);
        infoPanelData = [];

        getGeometry(labinsURL + '8', 'tile_name', event.target.value)
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

      // query id and name fields through two buttons
      var inputAfter = document.getElementById('textQuery');
      var submitButton = document.getElementById('submitQuery');

      // clear other elements when keypress happens
      query(inputAfter).on('keypress', function () {
        clearDiv('informationdiv');
        resetElements(inputAfter);
      });

      query(submitButton).on('click', function (event) {
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
      createCountyDropdown(labinsURL + '7', 'county');
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

      query(countyDropdownAfter).on('change', function (event) {
        clearDiv('informationdiv');
        resetElements(countyDropdownAfter);
        infoPanelData = [];
        getGeometry(countyBoundariesURL + '2', 'name', event.target.value.replace(/[\s.-]/g, ''))
          .then(unionGeometries)
          .then(function (response) {
            dataQueryQuerytask(labinsURL + '7', response)
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

      query(submitButton).on('click', function (event) {
        clearDiv('informationdiv');
        infoPanelData = [];
        textQueryQuerytask(labinsURL + '7', 'ecl_name', inputAfter.value)
          .then(function (response) {
            for (i = 0; i < response.features.length; i++) {
              response.features[i].attributes.layerName = 'Erosion Control Line';
              infoPanelData.push(response.features[i]);
            }
            goToFeature(infoPanelData[0]);
            queryInfoPanel(infoPanelData, 1, event);
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

      query(submitButton).on('click', function (event) {
        infoPanelData = [];
        textQueryQuerytask(swfwmdURL + '/0', 'BENCHMARK_NAME', inputAfter.value)
          .then(function (response) {
            for (i = 0; i < response.features.length; i++) {
              response.features[i].attributes.layerName = 'Survey Benchmarks';
              infoPanelData.push(response.features[i]);
            }
            goToFeature(infoPanelData[0]);
            queryInfoPanel(infoPanelData, 1, event);
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
    let dataQueryPanelBody = document.getElementById('collapseQuery');

    identifyPanel.setAttribute('class', 'panel collapse');
    identifyPanel.setAttribute('style', 'height:0px;');

    identifyStyle.setAttribute('class', 'panel-collapse collapse');
    identifyStyle.setAttribute('style', 'height:0px;');

    dataQueryPanel.setAttribute('class', 'panel collapse in');
    dataQueryPanel.setAttribute('style', 'height:auto;');

    dataQueryPanelBody.setAttribute('class', 'panel collapse in');
    dataQueryPanelBody.setAttribute('style', 'height:auto;');
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
    $('#infoSpan').html('Information Panel');
  });

  // after a query typed into search bar
  searchWidget.on("search-complete", async function (event) {
    
    infoPanelData = [];
    // 6 is the ESRI Geocoder service
    if (!(event.results[0].sourceIndex === 6)) {
    
      // change the layername based on which layer is searched on (because the search query looks at )
      var layerName = event.results["0"].results[0].feature.layer.name;
      event.results["0"].results["0"].feature.attributes.layerName = layerName;

      //clear content of information panel
      clearDiv('informationdiv');
      $('#numinput').val('');
      $('#infoSpan').html('Information Panel');

      // push query results of search bar to information panel
      infoPanelData.push(event.results["0"].results["0"].feature);
      await queryInfoPanel(infoPanelData, 1, event);
      goToFeature(infoPanelData[0]);
      togglePanel();
    } else {
      clearDiv('informationdiv');
      $('#numinput').val('');
      $('#infoSpan').html('Information Panel');
    }
  });

  // set up alert for dynamically created zoom to feature buttons
  $(document).on('click', "button[name='zoom']", function () {
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
  new Basemaps({
    container: "basemapGalleryDiv",
    view: mapView
  })

  // if screen width under 992 pixels, put legend and layerlist widget button into navigation bar menu
  if (screen.availWidth < 992) {
    new Legend({
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
    on(dom.byId("desktopLegend"), "click", function (event) {
      // if legend status != 1 (not currently being displayed), add it to the map
      if (legendStatus != 1) {
        mapView.ui.remove(scaleBar);
        // custom header to display a header and close button
        const header = `
        <div id="legendHeader" style="background-color:#315866; padding-bottom: 5px; position: sticky; top: 0;">
          <span class="glyphicon glyphicon-list-alt" aria-hidden="true" style="color: white; margin-right: 5px; margin-top: 5px; margin-left: 10px;"></span>
          <span id="infoSpan" class="panel-label"  style="color: white; margin-top: 5px;">Legend</span>
          <button id="closeLgdBtn" type="button" class="btn text-right" style="display: inline-block; background-color: transparent; float: right;">
            <span class="esri-icon esri-icon-close" style="color:white; display:inline-block; float:left;" aria-hidden="true"></span>
          </button>
        </div>
        `
        mapView.ui.add([legendWidget, scaleBar], "bottom-left");
        // add legend header to beginning of div
        $("#legendDiv").prepend(header);
        const closebtn = document.getElementById('closeLgdBtn');
        on(closebtn, "click", function (event) {
          $("#legendHeader").remove();
          mapView.ui.remove(legendWidget);
          legendStatus = 0;
        });
        legendStatus = 1;
      } else {
        $("#legendHeader").remove();
        mapView.ui.remove(legendWidget);
        legendStatus = 0;
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
  new Print({
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