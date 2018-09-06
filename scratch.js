    //this is a spatial intersect
    // populate dropdown only where there are results returned
    function buildPopulatedSelectPanel (url, attribute, zoomParam, panelParam) {
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
            console.log(uniqueValues);
            for (var i=0; i < uniqueValues.length; i++) {
              console.log(uniqueValues[i]);
              console.log(attribute);
              getGeometry(url, attribute, uniqueValues[i])
              .then(unionGeometries)
              .then(function(response) {
                var queryTask = new QueryTask({
                  url: 'https://admin205.ispa.fsu.edu/arcgis/rest/services/LABINS/Control_Points_3857/MapServer/0'
                });
                var params = new Query({
                  where: '1=1',
                  geometry: response,
                  returnGeometry: false,
                  outFields: '*'
                });
                return queryTask.execute(params)
                .then(function (response) { 
                  if ( response.features.length = 0) {
                  console.log(response); 
                  }
                })
              });
            }
        });
      }