require([
  // ArcGIS
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/MapImageLayer",
  "esri/layers/FeatureLayer",
  "esri/tasks/QueryTask",
  "esri/tasks/support/Query",
  "esri/geometry/geometryEngine",
  "esri/geometry/projection",
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
  "esri/widgets/Measurement",
  "esri/widgets/Swipe",
  "esri/widgets/Bookmarks",
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
  projection,
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
  Measurement,
  Swipe,
  Bookmarks,
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
          symbol: {
            ...default_symbol
          }
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
      uniqueValueInfos: buildValueInfos(),
      defaultSymbol: default_symbol,
      defaultLabel: 'Unknown',
      legendOptions: {
        title: 'Source'
      },
      valueExpression: `
          var c = Concatenate([$feature.pos_srce, $feature.vert_srce], ',');
          When(Find(c, "SCALED,POSTED|SCALED,RESET|SCALED,ADJUSTED|NO CHECK,POSTED|NO CHECK,RESET|NO CHECK,ADJUSTED|HD_HELD1,POSTED|HD_HELD1,RESET|HD_HELD1,ADJUSTED|HD_HELD2,POSTED|HD_HELD2,RESET|HD_HELD2,ADJUSTED") != -1, 'Vertical',
          Find(c, "ADJUSTED,GPS OBS|ADJUSTED,VERTCON|ADJUSTED,SCALED|ADJUSTED,LEVELING|ADJUSTED, |ADJUSTED,NOT PUB|ADJUSTED,VERT ANG|NO CHECK,GPS OBS") != -1, 'Horizontal',
          Find(c, "ADJUSTED,POSTED|ADJUSTED,RESET|ADJUSTED,ADJUSTED") != -1, 'Hor. & Ver.',
          Find(c, "SCALED,NOT PUB|SCALED,VERTCON|NO CHECK, |NO CHECK,NOT PUB|NO CHECK,SCALED|NO CHECK,VERTCON|HD_HELD1,NOT PUB|HD_HELD1,VERTCON|HD_HELD2,NOT PUB|HD_HELD2,VERTCON") != -1, 'Not Classified',
          'default');
        `
    };

    return customRenderer;
  }

  // const ngsLayerURL = "https://services2.arcgis.com/C8EMgrsFcRFL6LrL/ArcGIS/rest/services/ngs_datasheets/FeatureServer/0";
  const ngsLayerURL = "https://services2.arcgis.com/C8EMgrsFcRFL6LrL/arcgis/rest/services/NGS_Datasheets_Feature_Service/FeatureServer/0";
  const ngsLayer = new FeatureLayer({
    url: ngsLayerURL,
    outFields: ["pos_srce", "vert_srce"],
    title: "NGS Control Points",
    definitionExpression: "STATE = 'FL'",
    renderer: buildNGSRenderer(),
    minScale: minimumDrawScale,
    labelsVisible: true,
    labelingInfo: [{
      labelExpressionInfo: {
        expression: '$feature.NAME'
      },
      labelPlacement: 'above-right',
      symbol: {
        type: "text",
        color: "black",
        haloColor: "white",
        haloSize: "2px",
        xoffset: -5,
        yoffset: -5,
        font: {
          size: 8
        }
      }
    }]
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

  var labinsURL = "https://maps.freac.fsu.edu/arcgis/rest/services/LABINS/LABINS_Data_ccr_relate/MapServer/";
  var labinsLayer = new MapImageLayer({
    title: "LABINS Data",
    url: labinsURL,
    sublayers: [{
        id: 17,
        title: "Erosion Control Line1",
        visible: true,
        popupEnabled: false,
        minScale: minimumDrawScale
    }, {
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
      labelsVisible: true
    }, {
      id: 14,
      title: "Hi-Res Imagery Grid: State Plane North",
      visible: true,
      popupEnabled: false,
      minScale: minimumDrawScale,
      labelingInfo: haloLabelInfo("[spn_id]", [230, 76, 0, 255]),
      labelsVisible: true
    }, {
      id: 13,
      title: "Hi-Res Imagery Grid: State Plane West",
      visible: true,
      popupEnabled: false,
      minScale: minimumDrawScale,
      labelingInfo: haloLabelInfo("[spw_id]", [230, 76, 0, 255]),
      labelsVisible: true
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
      labelingInfo: haloLabelInfo("[blmid]", [0, 0, 255, 255]),
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
  var townshipRangeSectionURL = "https://maps.freac.fsu.edu/arcgis/rest/services/LABINS/LABINS_Data_ccr_relate/MapServer/10"
  var townshipRangeSectionLayer = new FeatureLayer({
    url: townshipRangeSectionURL,
    outFields: ["twn_ch", "rng_ch", "sec_ch"],
    title: "Section Lines",
    visible: false,
    listMode: "hide",
    popupEnabled: false
  });

  const newCCRURL = "https://maps.freac.fsu.edu/arcgis/rest/services/LABINS/LABINS_Data_ccr_relate/MapServer/2";
  const newCCRLayer = new FeatureLayer({
    url: newCCRURL,
    title: "New Certified Corner Records",
    minScale: minimumDrawScale,
    visible: true,
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
  var highlightPointAddr = {
    type: "simple-marker",
    style: "x",
    outline: {
      width: 5,
      color: [255, 105, 180, 1]
    },
    color: [255, 105, 180, 0.52]
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

  // only load overviewMap on non-mobile devices
  if (screen.availWidth > 992) {
    // Create another Map, to be used in the overview "view"
    var overviewMap = new Map({
      basemap: "topo"
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

    var extentDiv = document.getElementById("extentDiv");
    const overviewDiv = document.getElementById('overviewDiv');
    const overviewMapNavToggleButton = document.getElementById("desktopOverviewMap");

    // if overviewMapNavToggleButton is clicked
    // toggle the overview map visible/not-visible
    overviewMapNavToggleButton.addEventListener("click", function () {
      if (overviewMapNavToggleButton.classList.contains("ovwHide")) {
        overviewMapNavToggleButton.setAttribute('title', 'Show Map Overview');
        overviewMapNavToggleButton.innerHTML = 'Show Map Overview';
        overviewMapNavToggleButton.classList.remove("ovwHide");
        overviewMapNavToggleButton.classList.add("ovwShow");
        overviewDiv.getElementsByClassName('esri-view-root')[0].style.display = 'none';
        extentDiv.style.display = 'none';
      } else {
        overviewMapNavToggleButton.classList.remove("ovwShow");
        overviewMapNavToggleButton.classList.add("ovwHide");
        overviewMapNavToggleButton.innerHTML = 'Hide Map Overview';
        overviewMapNavToggleButton.setAttribute('title', 'Show Map Overview');
        overviewDiv.getElementsByClassName('esri-view-root')[0].style.display = 'block';
        extentDiv.style.display = 'block';
      }
      overviewDiv.classList.toggle('hide');
    });

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
  }

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

  const BOOKMARK_KEY = "arcgis-local-bookmarks";
  const bookmarks = new Bookmarks({
    view: mapView,
    editingEnabled: true,
    bookmarks: [],
    container: "bookmarksDiv"
  });

  let bookmarkStatus;
  const bookmarksMenuBtn = document.getElementById("bookmarksMenuBtn")
  bookmarksMenuBtn.addEventListener("click", () => {
    // addCustomWidgetHeaders("desktopBookmarks", bookmarks, bookmarkStatus);
      // if bookmark status != 1, add it to the map
      
      // close the menu options
      const navbarToggleArr = document.getElementsByClassName("navbar-menu-toggle");
      for (i = 0; i < navbarToggleArr.length; i++) {
        navbarToggleArr[i].classList.remove("open");
      }
      
      if (bookmarkStatus != 1) {
        mapView.ui.remove(scaleBar);

        // custom header to display a header and close button
        const header = `
        <div id="bookmarksHeader" style="background-color:#315866; position: sticky; top: 0; z-index: 999; padding-top: 1px; padding-left: 10px">
          <span class="glyphicon esri-icon-layers" aria-hidden="true" style="color: white; margin-right: 5px; margin-top: 5px; margin-left: 2px;"></span>
          <span id="bookmarksSpan" class="panel-label"  style="color: white; margin-top: 5px;">Bookmarks</span>
          <button id="closeBookmarksBtn" type="button" class="btn text-right" style="display: inline-block; background-color: transparent; float: right;">
            <span class="esri-icon esri-icon-close" style="color:white; display:inline-block; float:left;" aria-hidden="true"></span>
          </button>
        </div>
        `
        mapView.ui.add([bookmarks, scaleBar], "bottom-left");
        // add bookmarks header to beginning of div
        $("#bookmarksDiv").prepend(header);

        const closebtn = document.getElementById('closeBookmarksBtn');
        on(closebtn, "click", function (event) {
          $("#bookmarksHeader").remove();
          mapView.ui.remove(bookmarks);
          bookmarkStatus = 0;
        });
        bookmarkStatus = 1;
      } else {
        $("#bookmarksHeader").remove();
        mapView.ui.remove(bookmarks);
        bookmarkStatus = 0;
      }
  });

  let existingData = [];
  const existingBookmarks = localStorage.getItem(BOOKMARK_KEY) || null;
  if (existingBookmarks) {
    existingData = JSON.parse(existingBookmarks);
    bookmarks.bookmarks = existingData;
  }

  // add all bookmarks to BOOKMARK_KEY in localStorage
  function addBookmarksToLocalStorage(bookmarks) {
    const rawBookmarks = bookmarks.bookmarks.map(bm => bm.toJSON());
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(rawBookmarks));
    existingData.push(rawBookmarks);
  }

  // watch for name, viewpoint, and thumbnail updates 
  bookmarks.bookmarks.forEach(function (bookmark) {
    bookmark.watch(["name", "viewpoint", "thumbnail"], function (newName, oldName, propName, target) {
      addBookmarksToLocalStorage(bookmarks);
    });
  });

  // watching for additions or deletes
  bookmarks.bookmarks.watch("length", () => addBookmarksToLocalStorage(bookmarks));
  
  function resetElements(currentElement, trs = true) {
    let doNotSelect = "#" + currentElement.id + ", #selectLayerDropdown";
    doNotSelect = trs ? doNotSelect : doNotSelect + ", .trs";

    $("select").not(doNotSelect).each(function () {
      this.selectedIndex = 0;
    });
  }

  /////////////////////////////
  /// Dropdown Select Panel ///
  /////////////////////////////

  // query layer and populate a dropdown
  function buildSelectPanel(url, attribute, zoomParam, panelParam, ngs = false, county = null) {

    let whereClause = county === null 
    ? ngs ? attribute + " IS NOT NULL AND STATE = 'FL'" : attribute + " IS NOT NULL"
    : ngs ? attribute + " IS NOT NULL AND STATE = 'FL'" : attribute + " IS NOT NULL and COUNTY = '" + county.toUpperCase() + "'"

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
      .then(fadeBuffer)
  }

  function zoomToTRFeature(results) {
    mapView.goTo(results.features);
    bufferLayer.graphics.removeAll();
    selectionLayer.graphics.removeAll();
    graphicArray = [];
    for (feature of results.features) {
      highlightGraphic = new Graphic(feature.geometry, highlightSymbol);
      graphicArray.push(highlightGraphic);
    }
    selectionLayer.graphics.addMany(graphicArray);
    return results;
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
  const fadeBuffer = async () =>  {
    var clrG = document.getElementById("clearGraphics")
    selectionLayer.opacity = 1;
    bufferLayer.opacity    = 1;
    if (clrG.checked) {
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(3500); // 3.5 seconds
      selectionLayer.opacity = .75;
      await delay(500);
      bufferLayer.opacity    = .45
      selectionLayer.opacity = .45;
      await delay(500);
      bufferLayer.opacity    = .25
      selectionLayer.opacity = .25;
      await delay(500);
      bufferLayer.opacity    = .05
      selectionLayer.opacity = .05;
      bufferLayer.graphics.removeAll();
      selectionLayer.graphics.removeAll();
    }
    return;
  }
  ///////////////////////
  /// Zoom to Feature ///
  ///////////////////////

  // Build County Drop Down
  buildSelectPanel(countyBoundariesURL + '0', 'tigername', "Zoom to a County", "selectCountyPanel");

  //Zoom to feature
  query("#selectCountyPanel").on("change", function (e) {
    resetElements(document.getElementById('selectCountyPanel'));
    return zoomToFeature(countyBoundariesURL + '0', e.target.value, 'tigername').then(fadeBuffer);
  });

  //Build Quad Dropdown panel
  buildSelectPanel(labinsURL + '8', "tile_name", "Zoom to a Quad", "selectQuadPanel");

  //Zoom to feature
  query("#selectQuadPanel").on("change", function (e) {
    resetElements(document.getElementById('selectQuadPanel'));
    return zoomToFeature(labinsURL + '8', e.target.value, "tile_name").then(fadeBuffer);
  });

  //Build City Dropdown panel
  buildSelectPanel(labinsURL + '11', "name", "Zoom to a City", "selectCityPanel");

  //Zoom to feature
  query("#selectCityPanel").on("change", function (e) {
    resetElements(document.getElementById('selectCityPanel'));
    return zoomToFeature(labinsURL + '11', e.target.value, "name").then(fadeBuffer);
  });

  ////////////////////////////////////////////////
  //// Zoom to Township/Section/Range Feature ////
  ////////////////////////////////////////////////

  const townshipSelect = document.getElementById("selectTownship");
  const rangeSelect = document.getElementById("selectRange");
  const sectionSelect = document.getElementById("selectSection");

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
    } catch (err) {
      console.error('Township/Range load failed: ', err);
    }
  })

  // Add the unique values to the subregion
  // select element. This will allow the user
  // to filter states by subregion.
  function buildTownshipDropdown(values) {
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
    sectionSelect.options.length = 0;
    const sectionArr = values.features
    const sectionIntArr = sectionArr.map(element => element.attributes.sec_ch);
    const sortedSections = [...new Set(sectionIntArr)].sort();
    const placeholder = document.createElement("option");
    placeholder.text = "Section";
    placeholder.disabled = true;
    sectionSelect.add(placeholder);
    sortedSections.forEach(function (value) {
      const option = domConstruct.create("option");
      option.text = value
      sectionSelect.add(option);
    });
    sectionSelect.selectedIndex = 0;
  }

  const validateResults = results => {
    $("#trs").prepend(
      `<div id="TRSAlert" class="alert alert-danger" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            Invalid Township-Range combination. Please enter a correct Township-Range combination.
          </div>`
    )
    window.setTimeout(function () {
      $("#TRSAlert").fadeTo(500, 0).slideUp(500, function () {
        $(this).remove();
      });
    }, 4000);
    // remove sections & throw error
    sectionSelect.options.length = 0;
    throw new Error('This is an invalid Township-Range combination');;
  }

  async function queryTRFlow(TRQuery) {
    const results = await townshipRangeSectionLayer.queryFeatures(TRQuery)
    if (results.features.length) {
      zoomToTRFeature(results)
      buildSectionDropdown(results)
    } else {
      validateResults(results);
    }
  }

  async function queryTR(type, whichDropdown) {
    if (whichDropdown === 'selectRange' && townshipSelect.selectedIndex !== 0) {
      const townshipValue = townshipSelect.value;
      const TRQuery = new Query({
        where: "rng_ch = '" + type.substr(0, 2) + "' AND rdir = '" + type.substr(2) + "' AND twn_ch = '" + townshipValue.substr(0, 2) + "' AND tdir = '" + townshipValue.substr(2) + "'",
        returnGeometry: true,
        outFields: ["*"]
      });
      queryTRFlow(TRQuery).then(fadeBuffer);
      //place the tr function here
    } else if (whichDropdown === 'selectTownship' && rangeSelect.selectedIndex !== 0) {
      const rangeValue = rangeSelect.value;
      const TRQuery = new Query({
        where: "twn_ch = '" + type.substr(0, 2) + "' AND tdir = '" + type.substr(2) + "' AND rng_ch = '" + rangeValue.substr(0, 2) + "' AND rdir = '" + rangeValue.substr(2) + "'",
        outFields: ["*"],
        returnGeometry: true
      });
      queryTRFlow(TRQuery).then(fadeBuffer);
    }
  }

  // when township changes, reset the section dropdown and execute queryTR.
  on(townshipSelect, "change", function (evt) {
    resetElements(townshipSelect, false);
    const type = evt.target.value;
    queryTR(type, 'selectTownship');
  });

  // when range changes, reset the section dropdown and execute queryTR .
  on(rangeSelect, "change", function (evt) {
    resetElements(rangeSelect, false);
    const type = evt.target.value;
    queryTR(type, 'selectRange');
  });

  on(sectionSelect, "change", function (e) {
    resetElements(sectionSelect, false);
    const type = e.target.value;
    zoomToSectionFeature(townshipRangeSectionURL, type, "sec_ch");
  });

  let infoPanelData = [];
  let layerList;

  // when mapView is ready, check that the services are online
  // if service is online, add to map
  // if service is offline, ignore
  mapView.when(async function () {

    // Add label toggles in Layerlist widget
    function defineActions(event) {
      if (["Certified Corners", "Hi-Res Imagery Grid State Plane East",
          "Hi-Res Imagery Grid: State Plane North", "Hi-Res Imagery Grid: State Plane West"
        ].includes(event.item.title)) {
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

    await checkServices();


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
          <span id="layerListSpan" class="panel-label"  style="color: white; margin-top: 5px;">Layerlist</span>
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
      selectionLayer.opacity = 1; // reset this because it may be 0 from a fadeBuffer call
      if (screen.availWidth > 992) { // if not on mobile device
        if ((measurement.viewModel.state == "disabled") || (measurement.viewModel.state == "measured")) {
          identifyTaskFlow(event, coordExpand.expanded == false, false, false, "click");

        }
      } else {
        identifyTaskFlow(event, false, true, false, "click");
      }
    });
  });

  function clearIdentifySelection() {
    mapView.graphics.removeAll();
    selectionLayer.graphics.removeAll();
    bufferLayer.graphics.removeAll();
    clearDiv('informationdiv');
    $('#numinput').val('');
    $('#infoSpan').html('Information Panel');
  }

  function checkScale(eventType, coordExpanParam, mobileView) {
    // check the scale, unless the identifyTask originated from a measurementIdenty
    // if from measurementIdenty, return true

    if (eventType == "click") {
      if ((mapView.scale < minimumDrawScale) && (coordExpanParam || mobileView)) {
        return true;
      }
    } else if ((eventType == "measurementIdentify") && (coordExpanParam || mobileView)) { // allow measurement identify to trigger at any scale
      return true;
    }
    // either not the right scale or 
    return false;
  }

  async function queryCCRRelatedFeatures (result) {
    let relatedFeatures = [];
    const ccp_rquery = {
      outFields: ["DOCNUM"],
      relationshipId: 0,
      objectIds: result.objectid
    };
    result.layerName = "Certified Corners"


    await newCCRLayer.queryRelatedFeatures(ccp_rquery).then(async function (res) {

      if (res[result.objectid]) {
        res[result.objectid].features.forEach(async function (feature) {
          await relatedFeatures.push(feature.attributes.docnum);
        });
      }
    });
    return relatedFeatures;
  }

  async function identifyTaskFlow(event, coordExpanParam, mobileView, geometry = false, eventType = "click") {
    if (checkScale(eventType, coordExpanParam, mobileView) == true) { // check if scale is where map features are visible or measurementIdentify
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
              if (geometry == false) {
                query.geometry = mapView.toMap(event);
                query.distance = 30;
                query.units = 'meters';
              } else {
                query.geometry = event;
              }
              query.returnGeometry = true;
              query.outFields = ['NAME', 'DEC_LAT', 'DEC_LON', 'COUNTY', 'DATA_SRCE', 'PID'];
              query.where = "STATE = 'FL'";
              await ngsLayer.queryFeatures(query)
                .then(function (response) {
                  for (feature in response.features) {
                    const controlPoint = response.features[feature];
                    controlPoint.attributes.layerName = controlPoint.layer.title;
                    infoPanelData.push(controlPoint);
                  }
                });
            } else {
              const task = new IdentifyTask(layer.layer.url)
              const params = await setIdentifyParameters(visibleLayers, eventType, event);
              const identify = await executeIdentifyTask(task, params);
              // push each feature to the infoPanelData
              for (feature of identify.results) {
                feature.feature.attributes.layerName = feature.layerName;
                let result = feature.feature.attributes
                if (result.layerName === 'Certified Corners') {
                  result.relatedFeatures = await queryCCRRelatedFeatures (result);
                }
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
        await goToFeature(infoPanelData[0], button = false);
      } else {
        $('#infoSpan').html('Information Panel - 0 features found.');
        $('#informationdiv').append('<p>This query did not return any features</p>');
      }
    }
    document.getElementById("mapViewDiv").style.cursor = "auto";
  }

  // fetch all map services before loading to map
  // if service returns good, add service to map
  async function checkServices() {
    const layers = [countyBoundariesLayer, labinsLayer, ngsLayer, swfwmdLayer, CCCLLayer, townshipRangeSectionLayer];
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
    } else if (eventType == "measured") {
      params.geometry = event;
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
  
  async function loadProjection() {
    projection.load()
  }
  // go to first feature of the infopaneldata array
  function goToFeature(feature, button = true) {

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
        // first we have to decide if this is an NGS point because we will get LAT/LON
        // instead of the world mercator coordinates everthing else is in.
        newPt = feature.geometry
        if (feature.geometry.x > -90){
          // ready to convert lat/lon to world mercator
          let outSpatialReference = new SpatialReference({
              wkid: 3857
          });
          loadProjection();
          var newPt = projection.project(feature.geometry,outSpatialReference)
        } else {
          // if it is a point other than NGS we just want to load the point and move on
          newPt = feature.geometry
        }
        // Remove current selection
        selectionLayer.graphics.removeAll();

        // Highlight the selected parcel
        highlightGraphic = new Graphic(feature.geometry, highlightPoint);
        selectionLayer.graphics.add(highlightGraphic);

        // TODO: Not working properly, else if not being triggered
        if (mapView.scale > 18055.954822) {
          mapView.goTo({
            target: newPt,
            zoom: 15
          });
        } else { // go to point at the current scale
          mapView.goTo({
            target: newPt,
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
        url: newCCRURL,
        name: 'Certified Corners'
      }),
      outFields: ["blmid", "tile_name", "image1", "image2", "quad_num", "objectid"],
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
      searchFields: ["NAME", "PID"],
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
      resultSymbol: highlightPointAddr,
      filter: {
        // Extent of Florida
        geometry: new Extent({
          xmin: -87.8,
          ymin: 24.4,
          xmax: -79.8,
          ymax: 31.2,
          "spatialReference": {
            "wkid": 4326
          }
        })
      }
    }],
  });

  CalciteMapsArcGISSupport.setSearchExpandEvents(searchWidget);

  ////////////////////////////
  ///// Data Query////////////
  ////////////////////////////

  // Layer choices to query
  var layerChoices = ['Select Layer', 'NGS Control Points', 'Certified Corners', 'Tide Interpolation Points', 'Tide Stations', 'Erosion Control Line', 'SWFWMD and Tampa Bay Points'];

  for (var i = 0; i < layerChoices.length; i++) {
    $('<option/>').val(layerChoices[i]).text(layerChoices[i]).appendTo('#selectLayerDropdown');
  }
  query("#selectLayerDropdown").on("change", function (event) {

    // get geometry based on query results
    async function getGeometry(url, attribute, value, outFields = false) {
      // modifies value to remove portions of the string in parentheses 
      value = value.replace(/ *\([^)]*\) */g, "")

      var task = new QueryTask({
        url: url
      });
      var query = new Query();
      query.returnGeometry = true;
      query.where = "Upper(" + attribute + ") LIKE '" + value.toUpperCase() + "%'"; //"ctyname = '" + value + "'" needs to return as ctyname = 'Brevard'
      if (outFields) { // define outfields or accept default of no outfields returned
        query.outFields = outFields
      }
      const results = task.execute(query);
      return results;
    }

    // data query by text
    async function multiTextQuerytask(url, attribute, queryStatement, idAttribute, idQueryStatement, ngs = false) {
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

    function createCountyDropdown(attributeURL, countyAttribute, ngs = false) {
      var countyDropdown = document.createElement('select');
      countyDropdown.setAttribute('id', 'countyQuery');
      countyDropdown.setAttribute('class', 'form-control');
      document.getElementById('parametersQuery').appendChild(countyDropdown);
      buildSelectPanel(attributeURL, countyAttribute, "Select a County", "countyQuery", ngs);
    }

    function createRMonumentDropdown(attributeURL, rMonumentAttribute, ngs = false, county) {
      removeRMonumentDropdown();
      const rMonumentDropdown = document.createElement('select');
      rMonumentDropdown.setAttribute('id', 'rMonumentQuery');
      rMonumentDropdown.setAttribute('class', 'form-control');
      document.getElementById('parametersQuery').appendChild(rMonumentDropdown);
      document.getElementById('countyQuery').parentNode.insertBefore(rMonumentDropdown, document.getElementById('countyQuery').nextSibling);
      buildSelectPanel(attributeURL, rMonumentAttribute, "Select an R-Monument", "rMonumentQuery", ngs, county);
    }

    function removeRMonumentDropdown() {
      rMonumentElement = document.getElementById('rMonumentQuery');
      rMonumentElement ? rMonumentElement.remove() : null
    }

    function createQuadDropdown(attributeURL, quadAttribute, ngs = false) {
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
      createCountyDropdown(ngsLayerURL, 'COUNTY', ngs = true);
      createQuadDropdown(ngsLayerURL, 'QUAD', ngs = true);
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
        multiTextQuerytask(ngsLayerURL, 'PID', textValue, 'NAME', textValue, ngs = true)
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
        textQueryQuerytask(newCCRURL, 'blmid', textValue)
          .then(async function (response) {
            for (i = 0; i < response.features.length; i++) {
              response.features[i].attributes.layerName = 'Certified Corners';
              response.features[i].attributes.relatedFeatures = await queryCCRRelatedFeatures(response.features[i].attributes);
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
      var rMonumentDropdownAfter = document.getElementById('rMonumentQuery');
      var inputAfter = document.getElementById('textQuery');

      // clear other elements when keypress happens
      query(inputAfter).on('keypress', function () {
        clearDiv('informationdiv');
        resetElements(inputAfter);
      });

      query(countyDropdownAfter).on('change', function (event) {
        const county = event.target.value
        county !== 'Select a County' ? createRMonumentDropdown(labinsURL + '6', 'unique_id', false, county) : removeRMonumentDropdown();
        clearDiv('informationdiv');
        resetElements(countyDropdownAfter);
        infoPanelData = [];
        getGeometry(labinsURL + '7', 'county', county, '*')
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

      query(rMonumentDropdownAfter).on('change', function (event) {
        clearDiv('informationdiv');
        resetElements(rMonumentDropdownAfter);
        infoPanelData = [];
        getGeometry(labinsURL + '6', 'unique_id', event.target.value, '*')
          .then(function (response) {
            for (i = 0; i < response.features.length; i++) {
              response.features[i].attributes.layerName = 'R-Monuments';
              infoPanelData.push(response.features[i]);
            }
            goToFeature(infoPanelData[0]);
            queryInfoPanel(infoPanelData, 1);
            togglePanel();
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

    } else if (layerSelection === 'SWFWMD and Tampa Bay Points') {
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

  // after a query typed into search bar
  searchWidget.on("search-complete", async function (event) {
    infoPanelData = [];
    const results = event.results
    // 6 is the ESRI Geocoder service
    if (!(results[0].sourceIndex === 6)) {
      // grab layername from search result
      var layerName = results["0"].results[0].feature.layer.name;
      
      if (layerName == "Certified Corners") {
        results["0"].results["0"].feature.attributes.layerName = "Certified Corners";
        results[0].results[0].feature.attributes.relatedFeatures = await queryCCRRelatedFeatures (results[0].results[0].feature.attributes);
      }
      
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
          <span class="panel-label"  style="color: white; margin-top: 5px;">Legend</span>
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

    // auto expand ccWidget
    ccWidget._expanded = true;

    // Regular expression to find a number
    var numberSearchPattern = /-?\d+[\.]?\d*/;

    // Custom Projection: FL State Plane East - Feet
    var statePlaneEastFLft = new Format({
      name: 'FSP E - ft',
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
    ccWidget.formats.add(statePlaneEastFLft);

    // Custom Projection: FL State Plane West - Feet
    var statePlaneWestFLft = new Format({
      name: 'FSP W - ft',
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
    ccWidget.formats.add(statePlaneWestFLft);

    // Custom Projection: FL State Plane North - Feet
    var statePlaneNorthFLft = new Format({
      name: 'FSP N - ft',
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
    ccWidget.formats.add(statePlaneNorthFLft);

    // Custom Projection: FL State Plane East - Meters
    var statePlaneEastFLmt = new Format({
      name: 'FSP E - mt',
      conversionInfo: {
        spatialReference: new SpatialReference({
          wkid: 6437
        }),
        reverseConvert: function (string, format) {
          var parts = string.split(",")
          return new Point({
            x: parseFloat(parts[0]),
            y: parseFloat(parts[1]),
            spatialReference: {
              wkid: 6437
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
    ccWidget.formats.add(statePlaneEastFLmt);

    // Custom Projection: FL State Plane West - Meters
    var statePlaneWestFLmt = new Format({
      name: 'FSP W - mt',
      conversionInfo: {
        spatialReference: new SpatialReference({
          wkid: 6442
        }),
        reverseConvert: function (string, format) {
          var parts = string.split(",")
          return new Point({
            x: parseFloat(parts[0]),
            y: parseFloat(parts[1]),
            spatialReference: {
              wkid: 6442
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
    ccWidget.formats.add(statePlaneWestFLmt);

    // Custom Projection: FL State Plane North - Meters
    var statePlaneNorthFLmt = new Format({
      name: 'FSP N - mt',
      conversionInfo: {
        spatialReference: new SpatialReference({
          wkid: 6440
        }),
        reverseConvert: function (string, format) {
          var parts = string.split(",")
          return new Point({
            x: parseFloat(parts[0]),
            y: parseFloat(parts[1]),
            spatialReference: {
              wkid: 6440
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
    ccWidget.formats.add(statePlaneNorthFLmt);

    // Add the two custom formats to the top of the widget's display
    ccWidget.conversions.splice(0, 0,
      new Conversion({
        format: statePlaneEastFLft
      }),
      new Conversion({
        format: statePlaneWestFLft
      }),
      new Conversion({
        format: statePlaneNorthFLft
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

  // // keeps track of the active widget between distance measurement and area measurement
  // let activeWidget = null;

  // // listen to when the distance button is clicked in order to activate the distanceMeasurement widget
  // document.getElementById("distanceButton").addEventListener("click",
  //   function () {
  //     setActiveWidget(null);
  //     if (!this.classList.contains('active')) {
  //       setActiveWidget('distance');
  //     } else {
  //       setActiveButton(null);
  //     }
  //   });

  // // listen to when the area button is clicked in order to activate the areaMeasurement widget
  // document.getElementById("areaButton").addEventListener("click",
  //   function () {
  //     setActiveWidget(null);
  //     if (!this.classList.contains('active')) {
  //       setActiveWidget('area');
  //     } else {
  //       setActiveButton(null);
  //     }
  //   });

  // function to switch active widget between areaMeasurement and distanceMeasurement widgets
  // function setActiveWidget(type) {
  //   switch (type) {
  //     // if the distance measurement button was clicked
  //     case "distance":
  //       activeWidget = new DistanceMeasurement2D({
  //         view: mapView
  //       });
  //       // skip the initial 'new measurement' button
  //       activeWidget.viewModel.newMeasurement();
  //       mapView.ui.add(activeWidget, "bottom-left");
  //       setActiveButton(document.getElementById('distanceButton'));
  //       break;
  //       // if the area measurement button was clicked
  //     case "area":
  //       activeWidget = new AreaMeasurement2D({
  //         view: mapView,
  //       });
  //       // skip the initial 'new measurement' button
  //       activeWidget.viewModel.newMeasurement();
  //       // add the widget UI to the screen
  //       mapView.ui.add(activeWidget, "bottom-left");
  //       setActiveButton(document.getElementById('areaButton'));
  //       activeWidget.watch("viewModel.tool.active", async function (active) {
  //         if (active === false) {
  //           // if identify is checked, run a drill down identifyTask
  //           if (document.getElementById('measureIdentify').checked) {
  //             if (mapView.scale < minimumDrawScale) {
  //               document.getElementById("mapViewDiv").style.cursor = "wait";
  //               mapView.graphics.removeAll();
  //               selectionLayer.graphics.removeAll();
  //               clearDiv('informationdiv');
  //               infoPanelData = [];

  //               // look inside of layerList layers
  //               let layers = layerList.operationalItems.items
  //               // loop through layers
  //               for (layer of layers) {
  //                 let visibleLayers
  //                 // exclude geographic names layer from identify operation
  //                 if (layer.title !== 'Geographic Names') {
  //                   visibleLayers = await checkVisibleLayers(layer);
  //                   // if there are visible layers returned
  //                   if (visibleLayers.length > 0) {
  //                     const task = new IdentifyTask(layer.layer.url)
  //                     const params = await setIdentifyParameters(visibleLayers, "polygon", activeWidget.viewModel.measurement.geometry);
  //                     const identify = await executeIdentifyTask(task, params);
  //                     // push each feature to the infoPanelData
  //                     for (feature of identify.results) {
  //                       feature.feature.attributes.layerName = feature.layerName;
  //                       let result = feature.feature.attributes
  //                       // make sure only certified corners with images are identified
  //                       if (result.layerName !== 'Certified Corners' || result.is_image == 'Y') {
  //                         await infoPanelData.push(feature.feature);
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //               if (infoPanelData.length > 0) {
  //                 await queryInfoPanel(infoPanelData, 1);
  //                 togglePanel();
  //                 await goToFeature(infoPanelData[0]);
  //               } else { // if no features were found under the click
  //                 $('#infoSpan').html('Information Panel - 0 features found.');
  //                 $('#informationdiv').append('<p>This query did not return any features</p>');
  //               }
  //             }
  //             document.getElementById("mapViewDiv").style.cursor = "auto";
  //           }
  //         }
  //       });
  //       break;
  //     case null:
  //       if (activeWidget) {
  //         mapView.ui.remove(activeWidget);
  //         activeWidget.destroy();
  //         activeWidget = null;
  //       }
  //       break;
  //   }
  // }

  // function setActiveButton(selectedButton) {
  //   // focus the view to activate keyboard shortcuts for sketching
  //   mapView.focus();
  //   var elements = document.getElementsByClassName("active");
  //   for (var i = 0; i < elements.length; i++) {
  //     elements[i].classList.remove("active");
  //   }
  //   if (selectedButton) {
  //     selectedButton.classList.add("active");
  //   }
  // }

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
  const clearBtn = document.createElement("div");
  clearBtn.id = "clearButton";
  clearBtn.className = "esri-widget--button esri-interactive esri-icon-erase";

  // Clear all graphics from map  
  clearBtn.addEventListener("click", () => {
    mapView.graphics.removeAll();
    selectionLayer.graphics.removeAll();
    bufferLayer.graphics.removeAll();
    clearDiv('informationdiv');
    $('#numinput').val('');
    $('#infoSpan').html('Information Panel');
  });

  mapView.ui.add(clearBtn, "top-left");

  // measurement needs to be defined here or else it won't be in global scope
  let measurement;
  if (screen.availWidth > 992) {
    const measurementToolbar = document.createElement("div")
    measurementToolbar.id = "toolbar";
    measurementToolbar.className = "esri-component esri-widget";

    var measureExpand = new Expand({
      view: mapView,
      content: measurementToolbar,
      expandIconClass: "esri-icon-measure-area",
      expandTooltip: "Measurement Tools",
      collapseTooltip: "Measurement Tools",
    });

    mapView.ui.add(measureExpand, "top-left");


    // Measurement Widget
    measurement = new Measurement({
      view: mapView,
    });

    const distanceButton = document.createElement("button");
    distanceButton.id = "distance";
    distanceButton.className = "esri-widget--button esri-interactive esri-icon-measure-line";
    distanceButton.title = "Distance Measurement Tool";
    measurementToolbar.appendChild(distanceButton)

    const areaButton = document.createElement("button");
    areaButton.id = "area";
    areaButton.className = "esri-widget--button esri-interactive esri-icon-measure-area";
    areaButton.title = "Area Measurement Tool";
    measurementToolbar.appendChild(areaButton)

    const clearButton = document.createElement("button");
    clearButton.id = "clear";
    clearButton.className = "esri-widget--button esri-interactive esri-icon-trash";
    clearButton.title = "Clear Measurements";
    measurementToolbar.appendChild(clearButton);

    const measurementIdentifyToggleButton = document.createElement("button");
    measurementIdentifyToggleButton.id = "identifyMeasurement";
    measurementIdentifyToggleButton.className = "esri-widget--button esri-interactive esri-icon-description";
    measurementIdentifyToggleButton.title = "Identify Measurement";
    measurementToolbar.appendChild(measurementIdentifyToggleButton)
    

    measureExpand.watch("expanded", function () {
      if (measureExpand.expanded == false) {
        clearMeasurements();
      }
    });

    distanceButton.addEventListener("click", () => {
      distanceMeasurement();
      loadMeasurementWidget();
    });

    areaButton.addEventListener("click", () => {
      areaMeasurement();
      loadMeasurementWidget();
    });

    clearButton.addEventListener("click", () => {
      clearMeasurements();
      loadMeasurementWidget();
      clearIdentifySelection();
    });
    measurementIdentifyToggleButton.addEventListener("click", () => {
      measurementIdentify();
    });

    function loadMeasurementWidget() {
      // Add the appropriate measurement UI to the bottom-right when activated
      mapView.ui.empty("bottom-left"); // remove the scalebar and any other bottom-left
      mapView.ui.add([measurement, scaleBar], "bottom-left"); // add scalebar after measurement widget
    }

    // Call the appropriate DistanceMeasurement2D or DirectLineMeasurement3D
    function distanceMeasurement() {
      const type = mapView.type;
      measurement.activeTool =
        type.toUpperCase() === "2D" ? "distance" : "direct-line";
      distanceButton.classList.add("active");
      areaButton.classList.remove("active");
    }

    // Call the appropriate AreaMeasurement2D or AreaMeasurement3D
    function areaMeasurement() {
      measurement.activeTool = "area";
      distanceButton.classList.remove("active");
      areaButton.classList.add("active");
    }

    // Clears all measurements
    function clearMeasurements() {
      distanceButton.classList.remove("active");
      areaButton.classList.remove("active");
      measurement.clear();
    }

    function measurementIdentify() {
      // if measurement has finished, and the measurement tool is area measurement
      // initiate identify
      if (measurement.viewModel.state == "measured" && measurement.activeTool == "area") {
        identifyTaskFlow(measurement.viewModel.activeViewModel.measurement.geometry, coordExpand.expanded !== true, false, true, "measurementIdentify"); // need to determine how to get geometry
      }
    }
  }


  var swipeDiv = document.createElement("div");
  swipeDiv.id = "swipeDiv";
  swipeDiv.className = "esri-component esri-widget--button esri-widget"
  swipeDiv.role = "button";
  swipeDiv.tabindex = "0";
  swipeDiv.setAttribute("aria-label", "Swipe Tool");
  swipeDiv.title = "Swipe Tool";

  
  var swipeSpanIcon = document.createElement("span");
  swipeSpanIcon.setAttribute("aria-hidden", "true");
  swipeSpanIcon.className = "esri-icon esri-icon-sliders-horizontal";
  swipeSpanIcon.title = "Swipe Tool";

  var swipeSpanFallback = document.createElement("span");
  swipeSpanFallback.className = "esri-icon-font-fallback-text";
  swipeSpanFallback.innerHTML = "Swipe Tool"


  swipeDiv.appendChild(swipeSpanIcon);
  swipeDiv.appendChild(swipeSpanFallback);
  mapView.ui.add(swipeDiv,"top-left")

  mapView.ui.add(measureExpand, "top-left");

  let swipe = null;

    swipeDiv.addEventListener("click", () => {
      if (swipe == null) {

        let swipeParams = {
          view: mapView,
          leadingLayers: [labinsLayer, ngsLayer, CCCLLayer, swfwmdLayer, layer],
          trailingLayers: [],
          direction: "horizontal", // swipe widget will move from right to left of view
          position: 50 // position set to middle of the view (50%)
        }
        swipe = new Swipe(swipeParams);
        mapView.ui.add(swipe);
      } else if (swipe !== null) {
        swipe.destroy()
        swipe = null;
      }
    });


});