require([
  // ArcGIS
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/MapImageLayer",
  "esri/layers/FeatureLayer",
  "esri/tasks/QueryTask",
  "esri/tasks/support/Query",
  "esri/geometry/geometryEngine",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/tasks/IdentifyTask",
  "esri/tasks/support/IdentifyParameters",
  "esri/widgets/Popup/PopupViewModel",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/renderers/SimpleRenderer",
  "esri/tasks/Locator",
  "esri/tasks/GeometryService",
  "esri/geometry/support/webMercatorUtils",
  "esri/tasks/support/BufferParameters",
  "esri/geometry/SpatialReference",

  // Widgets
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
  "dojo/on",
  "dojo/dom",
  "dojo/promise/all",
  "dojo/dom-construct",
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
], function (Map,
  MapView,
  MapImageLayer,
  FeatureLayer,
  QueryTask,
  Query,
  geometryEngine,
  GraphicsLayer,
  Graphic,
  IdentifyTask,
  IdentifyParameters,
  PopupVM,
  SimpleFillSymbol,
  SimpleLineSymbol,
  SimpleRenderer,
  Locator,
  GeometryService,
  webMercatorUtils,
  BufferParameters,
  SpatialReference,
  Basemaps,
  Search,
  Legend,
  LayerList,
  Print,
  BasemapToggle,
  ScaleBar,
  Home,
  Locate,
  watchUtils, arrayUtils, on, dom, all, domConstruct, query, Color,
  Collapse,
  Dropdown,
  CalciteMaps,
  CalciteMapsArcGISSupport) {

  var minimumDrawScale = 100000;

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
      id:7,
      title: "CCR with Images",
      visible: false,
      //popupTemplate: CCRTemplate,
      popupEnabled: false
    },  {
      id:6,
      title: "Geographic Names",
      visible: false,
      //popupTemplate: geonamesTemplate,
      popupEnabled: false
    },  {
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
      visible: true,
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

  var swfwmdURL = "https://www25.swfwmd.state.fl.us/ArcGIS/rest/services/AGOServices/AGOSurveyBM/MapServer/0";
  var swfwmdLayer = new FeatureLayer({
    url: swfwmdURL,
    title: "SWFWMD Benchmarks",
    popupEnabled: false,
    minScale: minimumDrawScale
  });

  var controlLinesURL = "https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/Control_Lines_3857/MapServer/";
  var controlLinesLayer = new MapImageLayer({
    url: controlLinesURL,
    sublayers: [{
      id: 9,
      title: "Soils June 2012 - Dept. of Agriculture",
      visible: false,
      //popupTemplate: soilsTemplate
      popupEnabled: false
    }, {
      id: 8,
      title: "Hi-Res Imagery Grid: State Plane East",
      visible: false,
      popupEnabled: false
    },{
      id: 7,
      title: "Hi-Res Imagery Grid: State Plane North",
      visible: false,
      popupEnabled: false
    }, {
      id: 6,
      title: "Hi-Res Imagery Grid: State Plane West",
      visible: false,
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
      popupEnabled: false
    }, {
      id: 2,
      title: "Township-Range-Section",
      visible: true,
      popupEnabled: false
    }, {
      id: 1,
      title: "Township-Range",
      visible: false,
      popupEnabled: false
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

  var highlightFeaturesLayer = new GraphicsLayer({
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
    layers: [swfwmdLayer, controlLinesLayer, townshipRangeSectionLayer, selectionLayer, controlPointsLayer, highlightFeaturesLayer]
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

  // clears selectionLayer (general feature highlighting) and highlightFeaturesLayer (data query highlighting)
  function clearGraphics() {
    console.log("cleared graphics");
    map.graphics.clear();
    selectionLayer.graphics.removeAll();
    highlightFeaturesLayer.removeAll();
  }

  // reset dropdowns and all inputs that are not equal to the current element. 
  function resetElements (currentElement) {
    // if elements are not equal to the current element
    // then reset to the initial values

    // find all dropdowns
    $("select").each(function() {
      if((this != currentElement) && (this != document.getElementById('selectLayerDropdown'))) {
        this.selectedIndex = 0
      }
    },
    // find all inputs
     $("input").each(function() {
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
        // Go to extent of features and highlight
        mapView.goTo(response.features);
        selectionLayer.graphics.removeAll();
        graphicArray = [];

        for (i=0; i<response.features.length; i++) {
          highlightGraphic = new Graphic(response.features[i].geometry, highlightSymbol);
          graphicArray.push(highlightGraphic);
          //multiPolygonGeometries.push(response.features[i].geometry);
        }
        selectionLayer.graphics.addMany(graphicArray);          
      });
      //return union;
  }

  // Build select panel for Information Panel 'Filter By Layer' dropdown
  // Query layerName property of all returned drill down identify Feature
  function buildUniquePanel () {
    //empty the filterLayerPanel
    domConstruct.empty("filterLayerPanel");
    //console.log('unique layers being built');
    var uniqueLayerNames = [];
    for(i = 0; i< infoPanelData.length; i++){  
      
      // if layername isn't found within the uniqueLayerNames array,
      // value of -1 is given, the layername is added to uniqueLayerNames array  
      if(uniqueLayerNames.indexOf(infoPanelData[i].attributes.layerName) === -1){
          uniqueLayerNames.push(infoPanelData[i].attributes.layerName);        
      } 
    } 
    // unique layers will always appear in the same order
    uniqueLayerNames.sort();
    // Create the placeholder
    var option = domConstruct.create("option");
    option.text = "Filter by Layer";
    dom.byId("filterLayerPanel").add(option);

    // Populate with unique layers
    uniqueLayerNames.forEach(function (value) {
      var option = domConstruct.create("option");
      option.text = value;
      dom.byId("filterLayerPanel").add(option);
    });
  }

  // Union geometries of multi polygon features
  function unionGeometries (response) {
    // Array to store polygons in
    var multiPolygonGeometries = [];
    for (i=0; i<response.features.length; i++) {
      multiPolygonGeometries.push(response.features[i].geometry);
    }
    var union = geometryEngine.union(multiPolygonGeometries);
    console.log(union);
    return union;
  }

  // the identify function that happens when a section is chosen from the Zoom to Feature panel
  function executeTRSIdentify(response) {
    console.log(response);
            
    identifyTask = new IdentifyTask(controlPointsURL);

    // Set the parameters for the Identify
    params = new IdentifyParameters();
    params.tolerance = 3;
    params.layerIds = [0, 2];
    params.layerOption = "all";
    params.width = mapView.width;
    params.height = mapView.height;
  
    // Set the geometry to the location of the view click
    params.geometry = response;
    params.mapExtent = mapView.extent;
    dom.byId("mapViewDiv").style.cursor = "wait";

    // This function returns a promise that resolves to an array of features
    // A custom popupTemplate is set for each feature based on the layer it
    // originates from
    identifyTask.execute(params).then(function(response) {
      var results = response.results;

      return [arrayUtils.map(results, function(result) {

        var feature = result.feature;
        var layerName = result.layerName;

        feature.attributes.layerName = layerName;
        if (layerName === 'Certified Corners') {
          feature.popupTemplate = CCRTemplate;
        } else if (layerName === 'NGS Control Points') {
          feature.popupTemplate = NGSIdentifyPopupTemplate;
        }
        //console.log(feature);
        return feature;
      }), params.geometry];
    }).then(showPopup); // Send the array of features to showPopup()

    // Shows the results of the Identify in a popup once the promise is resolved
    function showPopup(data) {
      response = data[0];
      geometry = data[1];

      if (response.length > 0) {
        mapView.popup.open({
          features: response,
          location: geometry.centroid
        });
      }
      dom.byId("mapViewDiv").style.cursor = "auto";
    }
    return identifyTask.execute(params);
  } 

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
        mapView.goTo(response.features);
        return response;
      })
      .then(createBuffer)
      .then(executeTRSIdentify)
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
        console.log(response);
        mapView.goTo(response.features);
        selectionLayer.graphics.removeAll();
        graphicArray = [];
        for (i=0; i<response.features.length; i++) {
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
    var bufferGeometry = response.features[0].geometry
    var buffer = geometryEngine.geodesicBuffer(bufferGeometry, 100, "feet", true);
    // add the buffer to the view as a graphic
    var bufferGraphic = new Graphic({
      geometry: buffer,
      symbol: highlightSymbol
    });
    selectionLayer.graphics.removeAll();
    selectionLayer.add(bufferGraphic);
    //console.log(bufferGeometry);
    return bufferGeometry;
    //return buffer;
  }

  ///////////////////////
  /// Zoom to Feature ///
  ///////////////////////

  
  // Build County Drop Down
  buildSelectPanel(controlLinesURL + "4", "ctyname", "Zoom to a County", "selectCountyPanel");

  //Zoom to feature
  query("#selectCountyPanel").on("change", function (e) {
    resetElements(document.getElementById('selectCountyPanel'));
    return zoomToFeature(controlLinesURL + "4", e.target.value, "ctyname")
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



  ////////////////////////////////////////////////
  //// Zoom to Township/Section/Range Feature ////
  ////////////////////////////////////////////////

  var townshipSelect = dom.byId("selectTownship");
  var rangeSelect = dom.byId("selectRange");
  var sectionSelect = dom.byId("selectSection");

  mapView.when(function () {
    return townshipRangeSectionLayer.when(function (response) {
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

  var queryTownship = dom.byId("selectRange");
  on(queryTownship, "change", function (e) {
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

  tasks.push(new IdentifyTask(controlPointsURL));
  tasks.push(new IdentifyTask(controlLinesURL));
  tasks.push(new IdentifyTask('https://www25.swfwmd.state.fl.us/ArcGIS/rest/services/AGOServices/AGOSurveyBM/MapServer/'));

  // Set the parameters for the Identify
  params = new IdentifyParameters();
  params.tolerance = 5;
  params.layerIds = [2, 0, 1, 4, 5, 9, 6];
  params.layerOption = "visible";
  params.width = mapView.width;
  params.height = mapView.height;
  params.returnGeometry = true;
  allParams.push(params);

  // Set the parameters for the Identify
  params = new IdentifyParameters();
  params.tolerance = 3;
  params.layerIds = [2, 5, 0];
  params.layerOption = "visible";
  params.width = mapView.width;
  params.height = mapView.height;
  params.returnGeometry = true;
  allParams.push(params);
  
  // Set the parameters for the Identify
  params = new IdentifyParameters();
  params.tolerance = 3;
  params.layerIds = [0];
  params.layerOption = "visible";
  params.width = mapView.width;
  params.height = mapView.height;
  params.returnGeometry = true;
  allParams.push(params);


  var identifyElements = [];
  var infoPanelData = [];
  var currentIndex;

  // On a double click, execute identifyTask once the map is within the minimum scale
  mapView.on("click", function(event) {
      if (mapView.scale < minimumDrawScale) {
        console.log(event);
        event.stopPropagation();
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
        $( '#' + this.id + '>div').each(function() {
          if (this.id === 'collapsePopup') {
            this.setAttribute('class', 'panel-collapse collapse in');
            this.setAttribute('style', 'height:auto;');
          }

        });
        
      }

    });

  }

  // multi service identifytask
  function executeIdentifyTask(event) {
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
    }

    for (i = 0; i < tasks.length; i++) {
      promises.push(tasks[i].execute(allParams[i]));
    }
    var iPromises = new all(promises);
    iPromises.then(function (rArray) {
      arrayUtils.map(rArray, function(response){
        var results = response.results;
        console.log(typeof results);
        return arrayUtils.map(results, function(result) {
          var feature = result.feature;
          var layerName = result.layerName;
          feature.attributes.layerName = layerName;
          if (layerName === 'USGS Quads') {
            feature.popupTemplate = quadsIdentifyTemplate;
          } else if (layerName === 'NGS Control Points') {
              feature.popupTemplate = NGSIdentifyPopupTemplate;
          } else if (layerName === 'Parcels') {
            feature.popupTemplate = parcelsIdentifyTemplate;
          } else if (layerName === 'Soils June 2012 - Dept. of Agriculture') {
            feature.popupTemplate = soilsTemplate;
          } else if (layerName === 'Preliminary NGS Points') {
            feature.popupTemplate = NGSPreliminaryIdentifypopupTemplate;
          } else if (layerName === 'Certified Corners') {
            feature.popupTemplate = CCRTemplate;
          } else if (layerName === 'Tide Stations') {
            feature.popupTemplate = tideStationsTemplate;
          } else if (layerName === 'Tide Interpolation Points') {
            feature.popupTemplate = tideInterpPointsTemplate;
          } else if (layerName === 'R-Monuments') {
            feature.popupTemplate = rMonumentsTemplate;
          } else if (layerName === 'Erosion Control Line') {
            feature.popupTemplate = erosionControlLineTemplate;
          } else if (layerName === 'Survey Benchmarks') {
            feature.popupTemplate = swfwmdLayerPopupTemplate;
          }
          //console.log(identifyElements);
          identifyElements.push(feature);
          infoPanelData.push(feature);

        });
      })
      // determine whether first index of identify 
      // is a polygon or point then do appropriate highlight and zoom
      if (infoPanelData[0].geometry.type === "polygon") {
        var ext = infoPanelData[0].geometry.extent;
        var cloneExt = ext.clone();
        mapView.goTo({
          target: infoPanelData[0],
          extent: cloneExt.expand(1.75)  
        });
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
        mapView.goTo({target: 
          infoPanelData[0].geometry,
          zoom: 15
        });
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
  function dataQueryQuerytask (url, geometry) {
    console.log(url);
    console.log(geometry);
    var queryTask = new QueryTask({
      url: url
    });
    var params = new Query({
      where: '1=1',
      geometry: geometry,
      returnGeometry: true,
      outFields: '*'
    });
    console.log(queryTask.execute(params));
    return queryTask.execute(params);
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
      locator: new Locator({ url: "//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer" }),
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
        //popupTemplate: NGSpopupTemplate
      },
      searchFields: ["name"],
      suggestionTemplate: "Designation: {name}, County {county}",
      displayField: "name",
      exactMatch: false,
      outFields: ["dec_lat", "dec_long", "pid", "county", "data_srce", "datasheet2", "name"],
      name: "NGS Control Points",
      placeholder: "Search by PID",
    }, {
      featureLayer: {
        url: controlPointsURL + "4",
        resultGraphicEnabled: false,
        //popupTemplate: tideStationsTemplate
      },
      searchFields: ["id", "countyname", "quadname"],
      displayField: "id",
      exactMatch: false,
      outFields: ["*"],
      name: "Tide Stations",
      placeholder: "Search by ID, County Name, or Quad Name",
    }, {
      featureLayer: {
        url: controlPointsURL + "5",
        //popupTemplate: tideInterpPointsTemplate
      },
      searchFields: ["iden", "cname", "tile_name", "station1", "station2"],
      suggestionTemplate: "ID: {iden}, County: {cname}",
      displayField: "iden",
      exactMatch: false,
      outFields: ["*"],
      name: "Tide Interpolation Points",
      placeholder: "Search by ID, County Name, Quad Name, or Station Name",
    },/* {
      featureLayer: {
        url: controlPointsURL + "4",
        popupTemplate: countyTemplate
      },
      searchFields: ["fips", "ctyname"],
      suggestionTemplate: "FIPS Code: {fips}, County Name {ctyname}",
      displayField: "fips",
      exactMatch: false,
      outFields: ["*"],
      name: "County Boundaries",
      placeholder: "Search by FIPS ID or County Name",
      resultSymbol: highlightSymbol
  }, {
      featureLayer: {
        url: controlPointsURL + "0",
        popupTemplate: quadsTemplate
      },
      searchFields: ["tile_name", "quad"],
      suggestionTemplate: "Quad Name: {tile_name}, Quad Number {quad}",
      displayField: "tile_name",
      exactMatch: false,
      outFields: ["*"],
      name: "Quads",
      placeholder: "Search by Quad Name or Quad number",
    }, {
      featureLayer: {
        url: controlPointsURL + "3",
        popupTemplate: cityLimitsTemplate
      },
      searchFields: ["name", "county"],
      suggestionTemplate: "City Name: {name}, Surrounding County: {county}",
      displayField: "name",
      exactMatch: false,
      outFields: ["*"],
      name: "City Limits",
      placeholder: "Search by City Name or Surrounding County",
    }, */{
      featureLayer: {
        url: controlPointsURL + "8",
        //popupTemplate: rMonumentsTemplate
      },
      searchFields: ["monument_name", "county"],
      suggestionTemplate: "R-Monument Name: {monument_name}, County: {county}",
      exactMatch: false,
      outFields: ["*"],
      name: "R-Monuments",
      placeholder: "Search by County Name or R-Monument Name",
    }, {
      featureLayer: {
        url: controlPointsURL + "9",
        //popupTemplate: erosionControlLineTemplate
      },
      searchFields: ["ecl_name", "county"],
      suggestionTemplate: "ECL Name: {ecl_name}, County: {county}",
      exactMatch: false,
      outFields: ["*"],
      name: "Erosion Control Lines",
      placeholder: "Search by County Name or Town Name",
    }, {
      featureLayer: {
        url: swfwmdURL,
        //popupTemplate: swfwmdLayerPopupTemplate
        resultGraphicEnabled: false
      },
      searchFields: ["BENCHMARK_NAME", "OBJECTID"],
      suggestionTemplate: "Benchmark Name: {BENCHMARK_NAME}, File Name: {FILE_NAME}",
      displayField: "BENCHMARK_NAME",
      exactMatch: false,
      outFields: ["*"],
      name: "Survey Benchmarks",
      placeholder: "Search by Survey Benchmark name",
    }, {
      featureLayer: {
        url: controlPointsURL + "2",
        //resultGraphicEnabled: true,
        //popupTemplate: CCRTemplate
      },
      searchFields: ["blmid", "tile_name"],
      displayField: "blmid",
      suggestionTemplate: "BLMID: {blmid}, Quad Name: {tile_name}",
      exactMatch: false,
      outFields: ["blmid", "tile_name", "image1", "image2", "objectid"],
      name: "Certified Corners",
      placeholder: "Search by BLMID or Quad Name",
    }, {
      featureLayer: {
        url: controlLinesURL + "1",
        //resultGraphicEnabled: true,
        //popupTemplate: TRSTemplate
      },
      searchFields: ["twn_ch", "rng_ch", "twnrngsec"],
      displayField: "twnrngsec",
      suggestionTemplate: "Township/Range/Section: {twnrngsec}",
      exactMatch: false,
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

  for (var i=0;i<layerChoices.length;i++){
    $('<option/>').val(layerChoices[i]).text(layerChoices[i]).appendTo('#selectLayerDropdown');
 }
 query("#selectLayerDropdown").on("change", function(e) {
  var queriedFeatures = [];


//Quad select
//buildSelectPanel(controlLinesURL + "0", "tile_name", "Zoom to a Quad", "selectQuadPanel");
  
  function getGeometry (url, attribute, value) {

    var task = new QueryTask({
    url: url
    });
    var query = new Query();
    query.returnGeometry = true;
    //query.outFields = ['*'];
    query.where = attribute + " = '" + value + "'"; //"ctyname = '" + value + "'" needs to return as ctyname = 'Brevard'

    console.log(task.execute(query));
    return task.execute(query);

    
    
    

      // for (i=0; i<results.features.length; i++) {
      //   multiPolygonGeometries.push(results.features[i]);
      // }

  }

  // unused, could be removed
  function dataQueryIdentify (url, response, layers) {
    console.log(response);
            
    identifyTask = new IdentifyTask(url);

    // Set the parameters for the Identify
    params = new IdentifyParameters();
    //params.tolerance = 3;
    params.layerIds = [layers];
    params.layerOption = "all";
    params.width = mapView.width;
    params.height = mapView.height;
  
    // Set the geometry to the location of the view click
    params.geometry = response;
    params.mapExtent = mapView.extent;
    dom.byId("mapViewDiv").style.cursor = "wait";

    return identifyTask.execute(params);
  }

  // data query by text
  function textQueryQuerytask (url, attribute, queryStatement, flag = true) {

    var whereStatement;
    if (typeof queryStatement == 'string' && flag === true) {
       whereStatement = "Upper(" + attribute +  ') LIKE ' + "'%" + queryStatement.toUpperCase() + "%'";
    } else {
      whereStatement = attribute +  ' = ' + "'" + queryStatement + "'";

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
    return queryTask.execute(params);
  }

  function createCountyDropdown () {
    var countyDropdown = document.createElement('select');
    countyDropdown.setAttribute('id', 'countyQuery');
    countyDropdown.setAttribute('class', 'form-control');
    document.getElementById('parametersQuery').appendChild(countyDropdown);
    buildSelectPanel(controlLinesURL + "4", "ctyname", "Select a County", "countyQuery");


  }

  function createQuadDropdown () {
    var quadDropdown = document.createElement('select');
    quadDropdown.setAttribute('id', 'quadQuery');
    quadDropdown.setAttribute('class', 'form-control');
    document.getElementById('parametersQuery').appendChild(quadDropdown);
    buildSelectPanel(controlLinesURL + "0", "tile_name", "Select a Quad", "quadQuery")
    
  }

  function createTextBox (id, placeholder) {
    var textbox = document.createElement('input');
    textbox.type = 'text';
    textbox.setAttribute('id', id);
    textbox.setAttribute('class', 'form-control');
    textbox.setAttribute('placeholder', placeholder);
    textbox.setAttribute('value', '');
    document.getElementById('parametersQuery').appendChild(textbox);
  }

  function createSubmit (text = 'Submit', id = 'submitQuery') {
    var submitButton = document.createElement('BUTTON');
    submitButton.setAttribute('id', id);
    submitButton.setAttribute('class', 'btn btn-primary');
    var t = document.createTextNode(text);
    submitButton.appendChild(t);
    document.getElementById('parametersQuery').appendChild(submitButton);

  }

  function createTextDescription (string) {
    var textDescription = document.createElement("P");
    var t = document.createTextNode(string);
    textDescription.appendChild(t);
    document.getElementById('parametersQuery').appendChild(textDescription);
  }

  // clear all child nodes from current div
  function clearDiv (div) {
    var paramNode = document.getElementById(div);
    while (paramNode.firstChild) {
      paramNode.removeChild(paramNode.firstChild);
    }
  }

  function addDescript () {
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
    createCountyDropdown();    
    createQuadDropdown();
    createTextBox('nameQuery', 'Enter name. Example: BG4871');
    createSubmit();

    var countyDropdownAfter = document.getElementById('countyQuery');
    // county event listener
    query(countyDropdownAfter).on('change', function(e) {
      resetElements(countyDropdownAfter);
      infoPanelData = [];      

      getGeometry(controlLinesURL + '4', 'ctyname', e.target.value)
      .then(unionGeometries)
      .then(function(response) {
        dataQueryQuerytask(controlPointsURL + '0', response)
        .then(function (response) {
          for (i=0;i<response.features.length;i++) {
            response.features[i].attributes.layerName = 'NGS Control Points QueryTask';
            infoPanelData.push(response.features[i]);
          }
          queryInfoPanel(infoPanelData, 1);
          togglePanel();
        });
      });
    });

    // Query the quad dropdown
    var quadDropdownAfter = document.getElementById('quadQuery');

    query(quadDropdownAfter).on('change', function(e) {
      resetElements(quadDropdownAfter);
      infoPanelData = [];      

      getGeometry(controlLinesURL + '0', 'tile_name', e.target.value)
      .then(unionGeometries)
      .then(function(response) {
        dataQueryQuerytask(controlPointsURL + '0', response)
        .then(function (response) {
          for (i=0;i<response.features.length;i++) {
            response.features[i].attributes.layerName = 'NGS Control Points QueryTask';
            infoPanelData.push(response.features[i]);
          }
          queryInfoPanel(infoPanelData, 1);
          togglePanel();
        });
      });
    });

    // Textbox Query
    var textboxAfter = document.getElementById('nameQuery');

    query(textboxAfter).on('keypress', function() {
      // once typing begins, all of the other elements in the map will reset
      resetElements(textboxAfter);
    });

    var submitAfter = document.getElementById('submitQuery');
    query(submitAfter).on('click', function(e) {
      infoPanelData = [];      
      var textValue = document.getElementById('nameQuery').value;

      textQueryQuerytask(controlPointsURL + '0', 'pid', textValue)
      .then(function (response) {
        for (i=0;i<response.features.length;i++) {
          response.features[i].attributes.layerName = 'NGS Control Points QueryTask';
          infoPanelData.push(response.features[i]);
        }
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
    query(submitAfter).on('click', function(e) {
      infoPanelData = [];      
      var textValue = document.getElementById('IDQuery').value;

      console.log(textValue);
      textQueryQuerytask(controlPointsURL + '2', 'blmid', textValue)
      .then(function (response) {
        console.log(response);
        for (i=0;i<response.features.length;i++) {
          response.features[i].attributes.layerName = 'Certified Corners';
          infoPanelData.push(response.features[i]);
        }
        queryInfoPanel(infoPanelData, 1);
        togglePanel();
      });
    });

  } else if (layerSelection === 'Tide Interpolation Points') {

    clearDiv('parametersQuery');
    addDescript();
    createCountyDropdown();
    createQuadDropdown();
    createTextBox('IDQuery', 'Enter an ID. Example: 1');
    createSubmit();

    var countyDropdownAfter = document.getElementById('countyQuery');

    query(countyDropdownAfter).on('change', function(e) {
      resetElements(countyDropdownAfter);
      infoPanelData = [];      

      getGeometry(controlLinesURL + '4', 'ctyname', e.target.value)
      .then(unionGeometries)
      .then(function(response) {
        dataQueryQuerytask(controlPointsURL + '5', response)
        .then(function (response) {
          for (i=0;i<response.features.length;i++) {
            response.features[i].attributes.layerName = 'Tide Interpolation Points';
            infoPanelData.push(response.features[i]);
          }
          queryInfoPanel(infoPanelData, 1);
          togglePanel();
        });
      });
    });

    // Query the quad dropdown
    var quadDropdownAfter = document.getElementById('quadQuery');

    query(quadDropdownAfter).on('change', function(e) {
      resetElements(quadDropdownAfter);
      infoPanelData = [];      

      getGeometry(controlLinesURL + '0', 'tile_name', e.target.value)
      .then(unionGeometries)
      .then(function(response) {
        dataQueryQuerytask(controlPointsURL + '5', response)
        .then(function (response) {
          for (i=0;i<response.features.length;i++) {
            response.features[i].attributes.layerName = 'Tide Interpolation Points';
            infoPanelData.push(response.features[i]);
          }
          queryInfoPanel(infoPanelData, 1);
          togglePanel();
        });
      });
    });

    // Textbox Query
    var textboxAfter = document.getElementById('IDQuery');
    
    query(textboxAfter).on('keypress', function() {
      resetElements(textboxAfter);
    });

    var submitAfter = document.getElementById('submitQuery');
    query(submitAfter).on('click', function(e) {
      infoPanelData = [];      
      var textValue = document.getElementById('IDQuery').value;
      textValue = parseInt(textValue);

      textQueryQuerytask(controlPointsURL + '5', 'iden', textValue)
      .then(function (response) {
        for (i=0;i<response.features.length;i++) {
          response.features[i].attributes.layerName = 'Tide Interpolation Points';
          infoPanelData.push(response.features[i]);
        }
        queryInfoPanel(infoPanelData, 1);
        togglePanel();
      });
    });
  
  } else if (layerSelection === 'Tide Stations') {
    clearDiv('parametersQuery');
    addDescript();
    createCountyDropdown();
    createQuadDropdown();
    createTextBox('textQuery', 'Enter an ID or Tide Station Name');
    // createTextBox('nameQuery', 'Example: KINGS FERRY, ST. MARYS');
    createSubmit('Submit by ID', 'submitIDQuery');
    createSubmit('Submit by Name', 'submitNameQuery');

    var countyDropdownAfter = document.getElementById('countyQuery');

    query(countyDropdownAfter).on('change', function(e) {
      resetElements(countyDropdownAfter);
      infoPanelData = [];      

      getGeometry(controlLinesURL + '4', 'ctyname', e.target.value)
      .then(unionGeometries)
      .then(function(response) {
        dataQueryQuerytask(controlPointsURL + '4', response)
        .then(function (response) {
          for (i=0;i<response.features.length;i++) {
            response.features[i].attributes.layerName = 'Tide Stations';
            infoPanelData.push(response.features[i]);
          }
          queryInfoPanel(infoPanelData, 1);
          togglePanel();
        });
      });
    });

    // Query the quad dropdown
    var quadDropdownAfter = document.getElementById('quadQuery');

    query(quadDropdownAfter).on('change', function(e) {
      resetElements(quadDropdownAfter);
      infoPanelData = [];      

      getGeometry(controlLinesURL + '0', 'tile_name', e.target.value)
      .then(unionGeometries)
      .then(function(response) {
        dataQueryQuerytask(controlPointsURL + '4', response)
        .then(function (response) {
          for (i=0;i<response.features.length;i++) {
            response.features[i].attributes.layerName = 'Tide Stations';
            infoPanelData.push(response.features[i]);
          }
          queryInfoPanel(infoPanelData, 1);
          togglePanel();
        });
      });
    });

    // query id and name fields through two buttons
    var inputAfter = document.getElementById('textQuery');
    var idButton = document.getElementById('submitIDQuery');
    var nameButton = document.getElementById('submitNameQuery');
    
    // clear other elements when keypress happens
    query(inputAfter).on('keypress', function() {
      resetElements(inputAfter);
    });

    query(idButton).on('click', function(e) {
      infoPanelData = [];
      var textValue = inputAfter.value.padStart(4, '0');

      textQueryQuerytask(controlPointsURL + '4', 'id', textValue, false)
      .then(function (response) {
        console.log(response)
        for (i=0;i<response.features.length;i++) {
          response.features[i].attributes.layerName = 'Tide Stations';
          infoPanelData.push(response.features[i]);
        }
        queryInfoPanel(infoPanelData, 1);
        togglePanel();
      });
    });

    query(nameButton).on('click', function(e) {
      infoPanelData = [];
      textQueryQuerytask(controlPointsURL + '4', 'name', inputAfter.value)
      .then(function (response) {
        for (i=0;i<response.features.length;i++) {
          response.features[i].attributes.layerName = 'Tide Stations';
          infoPanelData.push(response.features[i]);
        }
        queryInfoPanel(infoPanelData, 1);
        togglePanel();
      });
    });

  } else if (layerSelection === 'Erosion Control Line') {
    clearDiv('parametersQuery');
    addDescript();
    createCountyDropdown();
    createTextBox('textQuery', 'Enter an ECL Name')
    createSubmit('Submit by Name', 'submitNameQuery');

    var nameButton = document.getElementById('submitNameQuery');
    var countyDropdownAfter = document.getElementById('countyQuery');
    var inputAfter = document.getElementById('textQuery');

    
    // clear other elements when keypress happens
    query(inputAfter).on('keypress', function() {
      resetElements(inputAfter);
    });

    query(countyDropdownAfter).on('change', function(e) {
      resetElements(countyDropdownAfter);
      infoPanelData = [];      

      getGeometry(controlLinesURL + '4', 'ctyname', e.target.value)
      .then(unionGeometries)
      .then(function(response) {
        dataQueryQuerytask(controlPointsURL + '9', response)
        .then(function (response) {
          for (i=0;i<response.features.length;i++) {
            response.features[i].attributes.layerName = 'Erosion Control Line';
            infoPanelData.push(response.features[i]);
          }
          queryInfoPanel(infoPanelData, 1);
          togglePanel();
        });
      });
    });

    query(nameButton).on('click', function(e) {
      infoPanelData = [];
      textQueryQuerytask(controlPointsURL + '9', 'ecl_name', inputAfter.value)
      .then(function (response) {
        console.log(response)
        for (i=0;i<response.features.length;i++) {
          response.features[i].attributes.layerName = 'Erosion Control Line';
          infoPanelData.push(response.features[i]);
        }
        queryInfoPanel(infoPanelData, 1);
        togglePanel();
      });
    });

  } else if (layerSelection === 'Survey Benchmarks') {
    clearDiv('parametersQuery');
    addDescript();
    createTextBox('textQuery', 'Enter a Benchmark Name')
    createSubmit('Submit by Name', 'submitNameQuery');

    var nameButton = document.getElementById('submitNameQuery');
    var inputAfter = document.getElementById('textQuery');

    
    // clear other elements when keypress happens
    query(inputAfter).on('keypress', function() {
      resetElements(inputAfter);
    });

    query(nameButton).on('click', function(e) {
      infoPanelData = [];
      textQueryQuerytask(swfwmdURL, 'BENCHMARK_NAME', inputAfter.value)
      .then(function (response) {
        for (i=0;i<response.features.length;i++) {
          response.features[i].attributes.layerName = 'Survey Benchmarks';
          infoPanelData.push(response.features[i]);
        }
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
  query('#gobackBtn').on('click', function() {
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

  // switch to identify panel on click
  query('#goToIdentify').on('click', function(){
    togglePanel();
  });

  //Basemap panel change
  query("#selectBasemapPanel").on("change", function(e) {
    mapView.map.basemap = e.target.value;
  });

  // Clear all graphics from map  
  on(dom.byId("clearButton"), "click", function(evt){
    selectionLayer.graphics.removeAll(); 
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


  searchWidget.on("search-complete", function(event){
    infoPanelData = [];

    //var layerName = event.target.activeSource.name;
    // let's make an input that the queryInfoPanel functionw sants to see
    layerName = event.target.activeSource.name;
    if (layerName === 'NGS Control Points') {
      event.results["0"].results["0"].feature.attributes.layerName ='NGS Control Points QueryTask';
    } else if (layerName === 'Survey Benchmarks') {
      event.results["0"].results["0"].feature.attributes.layerName = 'Survey Benchmarks';
    } else {
      event.results["0"].results["0"].feature.attributes.layerName = layerName;
    }
    infoPanelData.push(event.results["0"].results["0"].feature);
    console.log(infoPanelData);
    //var extent = event.results[0].results[0];
    //var url = event.results["0"].results["0"].feature.layer.parsedUrl.path;
      // // general event
      // layer name
    console.log(event.target.activeSource.name);
    console.log(infoPanelData);
    queryInfoPanel(infoPanelData, 1);
    togglePanel();
     
    });
    
  query("#numinput").on("change", function(e) {
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
    mapView.goTo({target: 
      infoPanelData[indexVal].geometry,
      zoom: 15
    });
    }
    } else {
        //$('#numinput').val(currentIndex);
        console.log("number out of range");
    }
  });

    // Listen for the back button
    query("#back").on("click", function() {
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
        mapView.goTo({target: 
          infoPanelData[indexVal].geometry,
          zoom: 15
        });
      }
      }
      
  });
  
  // Listen for forward button
  query("#forward").on("click", function() {
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
        mapView.goTo({target: 
          infoPanelData[indexVal].geometry,
          zoom: 15
        });
      }
      }
      

  });
  
  // handle the dropdown layer selection
  // the identifyElements array will hold all of the identifyTask values
  query("#filterLayerPanel").on("change", function (e) {
    // intermediary container
    var infoPanelDataCopy = [];

    //copy to an infopaneldatacopy array
    for (i=0;i<identifyElements.length;i++) {
      infoPanelDataCopy.push(identifyElements[i]);
    }
    infoPanelData = [];

    console.log(e.target.value);
    // loop through copy array to check for selected layers
    for (i=0;i<infoPanelDataCopy.length;i++) {
      if (infoPanelDataCopy[i].attributes.layerName === e.target.value) {
        infoPanelData.push(infoPanelDataCopy[i]);
      }
    }
    // if layer changes to "filter by layer", reset everything
    if (e.target.value === "Filter by Layer") {
      for (i=0;i<identifyElements.length;i++) {
        infoPanelData.push(identifyElements[i]);
      }      
    }

    if (infoPanelData[0].geometry.type === "polygon") {
      var ext = infoPanelData[0].geometry.extent;
      var cloneExt = ext.clone();
      mapView.goTo({
        target: infoPanelData[0],
        extent: cloneExt.expand(1.75)  
      });
      // Remove current selection
      selectionLayer.graphics.removeAll();

      // Highlight the selected parcel
      highlightGraphic = new Graphic(infoPanelData[0].geometry, highlightSymbol);
      selectionLayer.graphics.add(highlightGraphic);
    } else if (infoPanelData[0].geometry.type === "point") {     

      // Remove current selection
      selectionLayer.graphics.removeAll();

      // Highlight the selected parcel
      highlightGraphic = new Graphic(infoPanelData[0].geometry, highlightPoint);
      selectionLayer.graphics.add(highlightGraphic);
      mapView.goTo({target: 
        infoPanelData[0].geometry,
        zoom: 15
      });
    }

    


    queryInfoPanel(infoPanelData, 1);

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



  /*
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
*/

  // Add a legend instance to the panel of a
  // ListItem in a LayerList instance
  const layerList = new LayerList({
    container: "legendDiv",
    view: mapView,
    listItemCreatedFunction: function(event) {
      const item = event.item;
      item.panel = {
        content: "legend",
        open: true
      };
    }
  });
  
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
  
});